import React, { useState, useEffect } from "react";
import TraceDashboard from "./TraceDashboard";
import {
  apiPlaceOrder,
  apiGetOrdersByConsumer
} from "../../api/api";


/* =========================
  CATEGORY EMOJIS & MAP
========================= */
const CATEGORY_EMOJIS = {
  All: "🛒",
  "Grains & Cereals": "🌾",
  "Pulses & Legumes": "🌱",
  Oilseeds: "🌻",
  Vegetables: "🥕",
  Fruits: "🍎",
  "Spices & Condiments": "🌶️",
};

const CROP_CATEGORY_MAP = {
  "Grains & Cereals": ["Rice", "Wheat", "Maize", "Jowar", "Bajra", "Ragi"],
  "Pulses & Legumes": ["Chickpea", "Pigeon Pea", "Green Gram", "Black Gram", "Lentil"],
  Oilseeds: ["Groundnut", "Mustard", "Sunflower", "Sesame", "Soybean"],
  Vegetables: ["Tomato", "Potato", "Onion", "Brinjal", "Chilli", "Okra"],
  Fruits: ["Mango", "Banana", "Apple", "Orange", "Grapes"],
  "Spices & Condiments": ["Turmeric", "Ginger", "Garlic", "Coriander", "Cumin"],
};

/* =========================
  HELPERS
========================= */
const getCropCategory = (cropName) => {
  for (const cat in CROP_CATEGORY_MAP) {
    if (CROP_CATEGORY_MAP[cat].map(c => c.toLowerCase()).includes(cropName.toLowerCase())) {
      return cat;
    }
  }
  return "Other";
};

export default function ConsumerDashboard({ currentUser, batches, getCropName, getTraceForBatch, placeOrder }) {
  const consumerId = currentUser.consumerId;

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(`cart_${consumerId}`);
    return saved ? JSON.parse(saved) : [];
  });

 const [orders, setOrders] = useState([]);
 

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartQuantity, setCartQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCartPage, setShowCartPage] = useState(false);
  const [isCartCheckout, setIsCartCheckout] = useState(false);
  const [showOrdersPage, setShowOrdersPage] = useState(false);
  const [showTraceDashboard, setShowTraceDashboard] = useState(false);
  const [selectedOrderForTrace, setSelectedOrderForTrace] = useState(null);

  /* =========================
    PERSISTENT CART & ORDERS PER CONSUMER
  ========================== */
  useEffect(() => {
    localStorage.setItem(`cart_${consumerId}`, JSON.stringify(cart));
  }, [cart, consumerId]);

  

  /* =========================
    AVAILABLE QUANTITIES
  ========================== */
  const [availableQuantities, setAvailableQuantities] = useState(() => {
    const initial = {};
    batches.forEach(b => {
      initial[String(b.batchId)] = b.quantity;
    });
    const saved = localStorage.getItem("availableQuantities");
    if (saved) {
      const savedObj = JSON.parse(saved);
      Object.keys(initial).forEach(batchId => {
        if (savedObj[batchId] != null) initial[batchId] = savedObj[batchId];
      });
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem("availableQuantities", JSON.stringify(availableQuantities));
  }, [availableQuantities]);
  useEffect(() => {
  async function loadOrders() {
    try {
      const data = await apiGetOrdersByConsumer(consumerId);
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to load orders", err);
    }
  }
  if (consumerId) loadOrders();
}, [consumerId]);

  /* =========================
    MAP BATCHES → PRODUCTS
  ========================== */
  const products = batches
    .filter(b => b.distributorId)
    .map(b => {
      const trace = getTraceForBatch(b.batchId) || [];
      const harvestTrace = trace.find(t => t.eventType === "HARVEST");
      const distributorTrace = trace.find(t => t.eventType === "TRANSPORT");

      const cropName = getCropName(b.cropId);
      const quantityUnit = b.quantityUnit === "Other" ? b.customUnit : b.quantityUnit;

      return {
        productId: String(b.batchId),
        cropName,
        category: getCropCategory(cropName),
        farmerLocation: harvestTrace?.location || b.farmLocation || "Unknown",
        harvestDate: harvestTrace?.timestamp || b.harvestDate,
        pesticidesUsed: b.pesticideName || "None",
        farmingType: b.pesticideType || "Unknown",
        quantity: b.quantity,
        quantityUnit,
        costPerUnit: b.costPerUnit,
        cropImage: b.cropImage || "",
        trace,
        transportDate: distributorTrace?.timestamp || new Date().toISOString(),
        distributorId: b.distributorId,
      };
    });

  /* =========================
    FILTER PRODUCTS
  ========================== */
  const filteredProducts = products.filter(p =>
    (selectedCategory === "All" || p.category === selectedCategory) &&
    p.cropName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* =========================
    CALCULATE TOTALS
  ========================== */
  const getTotalWithDelivery = (unitCost, qty) => {
    return unitCost * qty + unitCost * qty * 0.1; // 10% delivery
  };

  const getCartTotals = (cartItems = cart) => {
    let totalCost = 0, totalShipping = 0;
    cartItems.forEach(item => {
      totalCost += item.costPerUnit * item.quantity;
      totalShipping += item.costPerUnit * item.quantity * 0.1;
    });
    return { totalCost, totalShipping };
  };

  /* =========================
    CART HANDLERS
  ========================== */
  const addToCart = (product, quantity) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.productId);
      if (existing) {
        return prev.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: Math.min(item.quantity + quantity, availableQuantities[product.productId] ?? product.quantity) }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    alert(`${quantity} ${product.cropName} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId, newQty) => {
    setCart(prev => prev.map(item =>
      item.productId === productId
        ? { ...item, quantity: Math.min(Math.max(newQty, 1), availableQuantities[productId] ?? item.quantity) }
        : item
    ));
  };

  /* =========================
    PLACE ORDER
  ========================== */
  const handlePlaceOrder = async (orderItems) => {
  const items = Array.isArray(orderItems) ? orderItems : [orderItems];

  for (const orderItem of items) {
    const distributorId =
      orderItem.trace?.find(t => t.eventType === "TRANSPORT")?.actorId ||
      orderItem.distributorId;

    if (!distributorId) {
      alert("Cannot place order: Distributor not found for " + orderItem.cropName);
      return;
    }

    if (orderItem.quantity > (availableQuantities[orderItem.productId] ?? orderItem.quantity)) {
      alert("Cannot place order: Quantity exceeds available stock for " + orderItem.cropName);
      return;
    }

    const order = {
      orderId: "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      distributorId,
      batchId: orderItem.productId,
      consumerId,
      fullName: currentUser.fullName,
      phoneNumber: currentUser.phoneNumber,
      gender: currentUser.gender,
      address: [
        currentUser.defaultAddress,
        currentUser.city,
        currentUser.state,
        currentUser.country
      ].filter(Boolean).join(", ") || "Address not set",
      product: orderItem.cropName,
      quantity: orderItem.quantity,
      unit: orderItem.quantityUnit,
      unitCost: orderItem.costPerUnit,
      expectedDelivery: new Date(
        new Date(orderItem.transportDate).getTime() + 10 * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
      status: "PENDING",
      cropImage: orderItem.cropImage || "",
      trace: orderItem.trace || [],
    };

    // ✅ SAVE TO BACKEND
    await apiPlaceOrder(order);

    // ✅ UPDATE LOCAL STOCK (UI only)
    setAvailableQuantities(prev => ({
      ...prev,
      [orderItem.productId]:
        Math.max(0, (prev[orderItem.productId] ?? orderItem.quantity) - orderItem.quantity)
    }));
  }

  // 🔄 IMPORTANT: reload orders FROM BACKEND
  const refreshed = await apiGetOrdersByConsumer(consumerId);
  setOrders(refreshed);

  // 🧹 UI cleanup
  setCart(prev => prev.filter(item => !items.find(o => o.productId === item.productId)));
  setShowCheckout(false);
  setIsCartCheckout(false);
  setShowOrdersPage(true);

  alert("Order placed successfully!");
};


  /* =========================
    HIDE TRACE
  ========================== */
  const hideTrace = () => {
    setShowTraceDashboard(false);
    setSelectedOrderForTrace(null);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <div style={{ width: 220, padding: 20, background: "#fafafa", borderRight: "1px solid #ddd" }}>
        <h3>Categories</h3>
        {["All", ...Object.keys(CROP_CATEGORY_MAP)].map(cat => (
          <div
            key={cat}
            onClick={() => { setSelectedCategory(cat); setShowCartPage(false); setShowOrdersPage(false); hideTrace(); }}
            style={{
              padding: 10,
              cursor: "pointer",
              borderRadius: 6,
              background: selectedCategory === cat && !showCartPage && !showOrdersPage ? "#e6f4ff" : "transparent",
              fontWeight: selectedCategory === cat && !showCartPage && !showOrdersPage ? 600 : 400,
            }}
          >
            {CATEGORY_EMOJIS[cat]} {cat}
          </div>
        ))}

        <div
          onClick={() => { setShowCartPage(true); setShowOrdersPage(false); hideTrace(); }}
          style={{
            padding: 10,
            marginTop: 20,
            cursor: "pointer",
            borderRadius: 6,
            background: showCartPage ? "#e6f4ff" : "#f0f0f0",
            fontWeight: showCartPage ? 600 : 400,
          }}
        >
          🛒 Cart ({cart.length})
        </div>

        <div
          onClick={() => { setShowOrdersPage(true); setShowCartPage(false); hideTrace(); }}
          style={{
            padding: 10,
            marginTop: 10,
            cursor: "pointer",
            borderRadius: 6,
            background: showOrdersPage ? "#e6f4ff" : "#f0f0f0",
            fontWeight: showOrdersPage ? 600 : 400,
          }}
        >
          📦 My Orders ({orders.filter(o => o.consumerId === consumerId).length})
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: 20 }}>
        {/* MARKETPLACE */}
        {!showOrdersPage && !showCartPage && !showTraceDashboard && (
          <>
            <h2>Consumer Marketplace</h2>
            <input
              type="text"
              placeholder="Search crops..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: 10, marginBottom: 20, borderRadius: 6, border: "1px solid #ccc" }}
            />
            {filteredProducts.length === 0 && <p>No products found</p>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {filteredProducts.map(p => (
                <div key={p.productId} style={{ border: "1px solid #ccc", borderRadius: 10, overflow: "hidden", background: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                  {p.cropImage && <img src={p.cropImage} alt={p.cropName} style={{ width: "100%", height: 140, objectFit: "cover" }} />}
                  <div style={{ padding: 12 }}>
                    <h3>{p.cropName}</h3>
                    <p><b>Category:</b> {CATEGORY_EMOJIS[p.category]} {p.category}</p>
                    <p><b>Farm Location:</b> {p.farmerLocation}</p>
                    <p><b>Available Quantity:</b> {availableQuantities[p.productId] ?? p.quantity} {p.quantityUnit}</p>
                    <p><b>Harvested On:</b> {new Date(p.harvestDate).toLocaleDateString()}</p>
                    <p><b>Pesticides:</b> {p.pesticidesUsed}</p>
                    <p><b>Farming Type:</b> {p.farmingType}</p>
                    <p><b>Cost / {p.quantityUnit}:</b> ₹{p.costPerUnit}</p>
                    <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>Quantity:</span>
                        <input
                          type="number"
                          min={1}
                          max={availableQuantities[p.productId] ?? p.quantity}
                          value={cartQuantity}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            setCartQuantity(
                              isNaN(value)
                                ? 1
                                : Math.min(Math.max(1, value), availableQuantities[p.productId] ?? p.quantity)
                            );
                          }}
                          style={{ width: 70, padding: 6, textAlign: "center", borderRadius: 4, border: "1px solid #ccc" }}
                        />
                      </div>
                      <button
                        style={{ flex: 1, backgroundColor: "#4CAF50", color: "#fff" }}
                        onClick={() => { addToCart(p, cartQuantity); setCartQuantity(1); }}
                      >
                        Add to Cart
                      </button>
                      <button
                        style={{ flex: 1, backgroundColor: "#2196F3", color: "#fff" }}
                        disabled={(availableQuantities[p.productId] ?? p.quantity) === 0}
                        onClick={() => { setSelectedProduct({ ...p, quantity: cartQuantity }); setShowCheckout(true); setIsCartCheckout(false); }}
                      >
                        {(availableQuantities[p.productId] ?? p.quantity) === 0 ? "Out of Stock" : "Buy Now"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* CART PAGE */}
        {showCartPage && (
          <div>
            <h3>My Cart</h3>
            <button onClick={() => setShowCartPage(false)} style={{ marginBottom: 15 }}>⬅ Back to Marketplace</button>
            {cart.length === 0 && <p>Cart is empty.</p>}
            {cart.map(item => (
              <div key={item.productId} style={{ display: "flex", gap: 12, alignItems: "center", borderBottom: "1px solid #ccc", padding: 10 }}>
                <img src={item.cropImage} alt={item.cropName} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }} />
                <div style={{ flex: 1 }}>
                  <h4>{item.cropName}</h4>
                  <p>Available: {availableQuantities[item.productId] ?? item.quantity} {item.quantityUnit}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>Quantity:</span>
                    <input
                      type="number"
                      min={1}
                      max={availableQuantities[item.productId] ?? item.quantity}
                      value={item.quantity}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        updateCartQuantity(item.productId, isNaN(value) ? 1 : Math.min(Math.max(1, value), availableQuantities[item.productId] ?? item.quantity));
                      }}
                      style={{ width: 70, padding: 6, textAlign: "center", borderRadius: 4, border: "1px solid #ccc" }}
                    />
                  </div>
                  <p>₹{item.costPerUnit} per {item.quantityUnit}</p>
                  <p>Total: ₹{(item.costPerUnit * item.quantity).toFixed(2)}</p>
                  <p>Delivery: ₹{(item.costPerUnit * item.quantity * 0.1).toFixed(2)}</p>
                  <p>Grand Total: ₹{getTotalWithDelivery(item.costPerUnit, item.quantity).toFixed(2)}</p>
                </div>
                <div>
                  <button onClick={() => removeFromCart(item.productId)} style={{ backgroundColor: "#f44336", color: "#fff", padding: "6px 10px", border: "none", borderRadius: 4 }}>Remove</button>
                  <button onClick={() => { setSelectedProduct(item); setShowCheckout(true); setIsCartCheckout(false); setShowCartPage(false); }} style={{ marginTop: 6, backgroundColor: "#2196F3", color: "#fff", padding: "6px 10px", border: "none", borderRadius: 4 }}>Checkout</button>
                </div>
              </div>
            ))}
            {cart.length > 0 && (
              <div style={{ marginTop: 20, borderTop: "2px solid #ccc", paddingTop: 12 }}>
                <p><b>Total Cost:</b> ₹{getCartTotals().totalCost.toFixed(2)}</p>
                <p><b>Total Shipping:</b> ₹{getCartTotals().totalShipping.toFixed(2)}</p>
                <button
                  style={{ marginTop: 10, padding: "10px 15px", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: 6 }}
                  onClick={() => {
                    if (cart.length > 0) {
                      setShowCheckout(true);
                      setIsCartCheckout(true);
                      setShowCartPage(false);
                    }
                  }}
                >
                  Continue to Checkout
                </button>
              </div>
            )}
          </div>
        )}

        {/* ORDERS PAGE */}
        {showOrdersPage && (
          <div>
            <h3>My Orders</h3>
            <button onClick={() => setShowOrdersPage(false)} style={{ marginBottom: 15 }}>⬅ Back to Marketplace</button>
            {orders.filter(o => o.consumerId === consumerId).length === 0 && <p>No orders placed yet.</p>}
            {orders.filter(o => o.consumerId === consumerId).map(order => (
              <div key={order.orderId} style={{ display: "flex", gap: 12, alignItems: "center", borderBottom: "1px solid #ccc", padding: 10 }}>
                <img src={order.cropImage} alt={order.product} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }} />
                <div style={{ flex: 1 }}>
                  <h4>{order.product}</h4>
                  <p>Quantity: {order.quantity} {order.unit}</p>
                  <p>Unit Cost: ₹{order.unitCost}</p>
                  <p>Total (incl. delivery): ₹{getTotalWithDelivery(order.unitCost, order.quantity).toFixed(2)}</p>
                  <p>Status: {order.status}</p>
                  <p>Expected Delivery: {order.expectedDelivery}</p>
                </div>
                <div>
                  <button onClick={() => { setSelectedOrderForTrace(order); setShowTraceDashboard(true); }} style={{ backgroundColor: "#2196F3", color: "#fff", padding: "6px 10px", border: "none", borderRadius: 4 }}>View Traceability</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TRACE DASHBOARD MODAL */}
        {showTraceDashboard && selectedOrderForTrace && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}>
            <div style={{ background: "#fff", borderRadius: 10, width: "80%", maxWidth: 800, maxHeight: "90%", overflowY: "auto", padding: 20, position: "relative" }}>
              <button onClick={hideTrace} style={{ position: "absolute", top: 10, right: 10, fontSize: 18, border: "none", background: "transparent", cursor: "pointer" }}>✖</button>
              <TraceDashboard
                orders={[selectedOrderForTrace]}
                getTraceForBatch={getTraceForBatch}
                getCropName={getCropName}
                onBack={hideTrace}
              />
            </div>
          </div>
        )}

        {/* CHECKOUT MODAL */}
        {showCheckout && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}>
            <div style={{ background: "#fff", borderRadius: 10, width: 500, maxWidth: "95%", maxHeight: "90%", padding: 20, overflowY: "auto", position: "relative" }}>
              <button style={{ position: "absolute", top: 10, right: 10, fontSize: 18, border: "none", background: "transparent", cursor: "pointer" }} onClick={() => { setShowCheckout(false); setIsCartCheckout(false); }}>✖</button>
              <h3>Order Summary</h3>
              <div style={{ marginBottom: 10 }}>
                <p><b>Delivery To:</b> {currentUser.fullName || currentUser.username}, {currentUser.defaultAddress}, {currentUser.city}, {currentUser.state}, {currentUser.country}</p>
              </div>

              {isCartCheckout ? (
                <>
                  {cart.map(item => (
                    <div key={item.productId} style={{ borderBottom: "1px solid #ccc", padding: "6px 0" }}>
                      <p><b>{item.cropName}</b> - {item.quantity} {item.quantityUnit}</p>
                      <p>Unit Price: ₹{item.costPerUnit}</p>
                      <p>Delivery: ₹{(item.costPerUnit * item.quantity * 0.1).toFixed(2)}</p>
                      <p>Total: ₹{getTotalWithDelivery(item.costPerUnit, item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div style={{ marginTop: 10, borderTop: "2px solid #ccc", paddingTop: 10 }}>
                    <p><b>Total Cost:</b> ₹{getCartTotals().totalCost.toFixed(2)}</p>
                    <p><b>Total Delivery:</b> ₹{getCartTotals().totalShipping.toFixed(2)}</p>
                    <p><b>Grand Total:</b> ₹{(getCartTotals().totalCost + getCartTotals().totalShipping).toFixed(2)}</p>
                  </div>
                  <button
                    style={{ marginTop: 10, padding: "10px 15px", backgroundColor: "#2196F3", color: "#fff", border: "none", borderRadius: 6 }}
                    onClick={() => handlePlaceOrder(cart)}
                  >
                    Place All Orders
                  </button>
                </>
              ) : (
                selectedProduct && (
                  <>
                    <p><b>Product:</b> {selectedProduct.cropName}</p>
                    <p><b>Quantity:</b> {selectedProduct.quantity} {selectedProduct.quantityUnit}</p>
                    <p><b>Unit Cost:</b> ₹{selectedProduct.costPerUnit}</p>
                    <p><b>Delivery:</b> ₹{(selectedProduct.costPerUnit * selectedProduct.quantity * 0.1).toFixed(2)}</p>
                    <p><b>Total Amount:</b> ₹{getTotalWithDelivery(selectedProduct.costPerUnit, selectedProduct.quantity).toFixed(2)}</p>
                    <p><b>Expected Delivery:</b> {new Date(new Date(selectedProduct.transportDate).getTime() + 10*24*60*60*1000).toLocaleDateString()}</p>
                    <button
                      style={{ marginTop: 10, padding: "8px 12px", backgroundColor: "#2196F3", color: "#fff", border: "none", borderRadius: 6 }}
                      onClick={() => handlePlaceOrder(selectedProduct)}
                    >
                      Place Order
                    </button>
                  </>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}