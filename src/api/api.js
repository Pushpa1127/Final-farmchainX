// src/api/api.js

const BASE_URL = "http://localhost:8081/api";

/* =========================
   COMMON REQUEST HANDLER
========================= */
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json();
}

/* =========================
   AUTH APIs
========================= */

export async function apiRegister({ username, password, role }) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password, role }),
  });
}

export async function apiLogin({ username, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

/* =========================
   FARMER APIs
========================= */

export async function apiGetFarmers() {
  const data = await request("/farmers");
  return data.map(f => ({
    farmerId: f.id,
    name: f.name,
    location: f.location,
    contact: f.contact,
  }));
}

export async function apiCreateFarmer(farmer) {
  const saved = await request("/farmers", {
    method: "POST",
    body: JSON.stringify(farmer),
  });

  return {
    farmerId: saved.id,
    name: saved.name,
    location: saved.location,
    contact: saved.contact,
  };
}

export async function apiUpdateFarmer(farmerId, farmer) {
  return request(`/farmers/${farmerId}`, {
    method: "PUT",
    body: JSON.stringify(farmer),
  });
}

/* =========================
   CROP APIs
========================= */

export async function apiGetCrops() {
  const data = await request("/crops");
  return data.map(c => ({
    cropId: c.id,
    name: c.name,
    season: c.season,
    farmerId: c.farmerId,
  }));
}

export async function apiCreateCrop(crop) {
  const saved = await request(`/crops?farmerId=${crop.farmerId}`, {
    method: "POST",
    body: JSON.stringify({
      name: crop.name,
      season: crop.season,
    }),
  });

  return {
    cropId: saved.id,
    name: saved.name,
    season: saved.season,
    farmerId: saved.farmerId,
  };
}

/* =========================
   BATCH APIs
========================= */

export async function apiGetBatches() {
  const data = await request("/batches");
  return data.map(b => ({
    batchId: b.batchCode,
    cropId: b.cropId,
    farmerId: b.farmerId,
    quantity: b.quantity,
    quantityUnit: b.quantityUnit,
    customUnit: b.customUnit,
    harvestDate: b.harvestDate,
    pesticideName: b.pesticideName,
    pesticideType: b.pesticideType,
    totalCost: b.totalCost,
    status: b.status,
    currentLocation: b.currentLocation,
    distributorId: b.distributorId,
    costPerUnit: b.costPerUnit,
    cropImage: b.cropImage,
  }));
}

export async function apiCreateBatch(batch) {
  const saved = await request("/batches", {
    method: "POST",
    body: JSON.stringify(batch),
  });

  return {
    batchId: saved.batchCode,
    ...saved,
  };
}

/* =========================
   TRACE APIs
========================= */

export async function apiAddTrace(trace) {
  return request("/trace", {
    method: "POST",
    body: JSON.stringify({
      batchCode: trace.batchId,
      eventType: trace.eventType,
      location: trace.location,
      handledBy: trace.handledBy,
    }),
  });
}

export async function apiGetTraceForBatch(batchId) {
  const data = await request(`/trace/batch/${batchId}`);
  return data.map(t => ({
    traceId: t.id,
    batchId: t.batchId,
    timestamp: t.timestamp,
    eventType: t.eventType,
    location: t.location,
    handledBy: t.handledBy,
    actorId: t.actorId,
  }));
}

/* =========================
   DISTRIBUTOR APIs
========================= */

export async function apiGetDistributors() {
  return request("/distributors");
}

export async function apiUpdateDistributor(data) {
  return request("/distributors", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* =========================
   USERS (ADMIN)
========================= */

export async function apiGetUsers() {
  return request("/users");
}

export async function apiGetUsersByRole(role) {
  return request(`/users/role/${role}`);
}

export async function apiBlockUser(userId) {
  return request(`/admin/users/${userId}/block`, { method: "PUT" });
}

export async function apiUnblockUser(userId) {
  return request(`/admin/users/${userId}/unblock`, { method: "PUT" });
}

export async function apiMakeAdmin(userId) {
  return request(`/admin/users/${userId}/make-admin`, { method: "PUT" });
}

/* =========================
   ORDER APIs  ✅ NEW
========================= */

export async function apiPlaceOrder(order) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export async function apiGetOrdersByConsumer(consumerId) {
  return request(`/orders/consumer/${consumerId}`);
}

export async function apiGetOrdersByDistributor(distributorId) {
  return request(`/orders/distributor/${distributorId}`);

}
export async function apiUpdateOrderStatus(orderId, status) {
  return request(`/orders/${orderId}/status?status=${status}`, {
    method: "PUT",
  });
}

/* =========================
   INVENTORY APIs (OPTIONAL)
========================= */

export async function apiUpdateAvailableQuantity(batchId, quantity) {
  return request(`/inventory/${batchId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

/* =========================
   FEEDBACK APIs
========================= */

export async function apiSubmitFeedback(data) {
  return request("/feedback", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiGetMyFeedback(username) {
  return request(`/feedback/user/${username}`);
}

export async function apiGetAllFeedback() {
  return request("/feedback");
}

export async function apiReplyFeedback(feedbackId, reply) {
  return request(`/feedback/${feedbackId}/reply`, {
    method: "PUT",
    body: JSON.stringify({ reply }),
  });
}

/* =========================
   CONTACT APIs
========================= */

export async function apiSendContact(data) {
  return request("/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiGetMyContacts(username) {
  return request(`/contact/user/${username}`);
}

export async function apiGetAllContacts() {
  return request("/contact");
}

export async function apiReplyContact(contactId, replyText) {
  const res = await fetch(`${BASE_URL}/contact/${contactId}/reply`, {
    method: "PUT",
    headers: { "Content-Type": "text/plain" },
    body: replyText,
  });

  if (!res.ok) throw new Error("Reply failed");
  return res.json();
}
