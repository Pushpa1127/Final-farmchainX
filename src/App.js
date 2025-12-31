import React, { useEffect, useState } from "react";
import "./App.css";

import Layout from "./components/Layout";
import AuthPage from "./components/AuthPage";
import LandingPage from "./pages/LandingPage";

// Dashboards
import AdminDashboard from "./components/dashboards/AdminDashboard";
import FarmerDashboard from "./components/dashboards/FarmerDashboard";
import DistributorDashboard from "./components/dashboards/DistributorDashboard";
import ConsumerDashboard from "./components/dashboards/ConsumerDashboard";

// Tabs
import FarmersTab from "./components/FarmersTab";
import CropsTab from "./components/CropsTab";
import BatchesTab from "./components/BatchesTab";
import TraceTab from "./components/TraceTab";
import DistributorTab from "./components/DistributorTab";
import AdminFeedback from "./components/AdminFeedback";
import UserFeedback from "./components/UserFeedback";
import ContactTab from "./components/ContactPage";
import AdminContactTab from "./components/AdminContactTab";
import DistributorSearchTab from "./components/DistributorSearchTab";


// APIs
import {
  apiLogin,
  apiRegister,
  apiGetFarmers,
  apiCreateFarmer,
  apiGetCrops,
  apiCreateCrop,
  apiGetBatches,
  apiCreateBatch,
  apiAddTrace,
  apiGetTraceForBatch,
  apiUpdateDistributor,
  apiGetDistributors,
  apiGetUsers,
} from "./api/api";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Backend data
  const [farmers, setFarmers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [batches, setBatches] = useState([]);
  const [traceRecords, setTraceRecords] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [users, setUsers] = useState([]);

  /* ======================
     AUTH
  ====================== */

  useEffect(() => {
    if (currentUser?.role === "ADMIN") {
      apiGetUsers().then(setUsers);
    }
  }, [currentUser]);

  const handleLogin = async ({ identifier, password }) => {
    try {
      const res = await apiLogin({
        username: identifier,
        password,
      });

      setCurrentUser({
        id: res.id,
        username: res.username || identifier,
        role: res.role,
        farmerId: res.farmerId || null,
        distributorId: res.distributorId || null,
        consumerId: res.consumerId || null,
        email: res.email || "",
        fullName: res.fullName || "",
        phoneNumber: res.phoneNumber || "",
        gender: res.gender || "",
        defaultAddress: res.defaultAddress || "",
        city: res.city || "",
        state: res.state || "",
        country: res.country || "",
      });

      setActiveTab("dashboard");
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleRegister = async ({ username, password, role }) => {
    try {
      await apiRegister({ username, password, role });
      return true;
    } catch {
      return false;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowLanding(true);
    setActiveTab("dashboard");
  };

  /* ======================
     LOAD DATA FROM BACKEND
  ====================== */

  useEffect(() => {
    if (!currentUser) return;

    apiGetFarmers().then(setFarmers);
    apiGetCrops().then(setCrops);
    apiGetBatches().then(setBatches);
    apiGetDistributors().then(setDistributors);
  }, [currentUser]);


useEffect(() => {
  if (!currentUser) return;
  apiGetDistributors().then(setDistributors);
}, [currentUser]);

  /* ======================
     HELPERS
  ====================== */

  const getCropName = (cropId) => {
    const crop = crops.find((c) => c.cropId === cropId);
    return crop ? crop.name : "Unknown Crop";
  };

  const getFarmerName = (farmerId) => {
    const farmer = farmers.find((f) => f.farmerId === farmerId);
    return farmer ? farmer.name : "Unknown Farmer";
  };

  const getTraceForBatch = async (batchCode) => {
    return apiGetTraceForBatch(batchCode);
  };

  /* ======================
     DOMAIN FUNCTIONS
  ====================== */

  const addFarmer = async (data) => {
    const saved = await apiCreateFarmer(data);
    setFarmers((prev) => [...prev, saved]);
  };

  const addCrop = async (data) => {
    const saved = await apiCreateCrop(data);
    setCrops((prev) => [...prev, saved]);
  };

  const addBatch = async (data) => {
    const saved = await apiCreateBatch(data);
    setBatches((prev) => [...prev, saved]);
  };

  const addTraceRecord = async (data) => {
    const saved = await apiAddTrace(data);
    setTraceRecords((prev) => [...prev, saved]);
  };

  const updateDistributor = async (data) => {
    try {
      await apiUpdateDistributor(data);
      setCurrentUser((prev) => ({ ...prev, ...data }));
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update distributor");
    }
  };

  /* ======================
     BEFORE LOGIN
  ====================== */

  if (!currentUser) {
    if (showLanding) {
      return <LandingPage onLoginClick={() => setShowLanding(false)} />;
    }

    return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
  }

  /* ======================
     ROLE BASED TABS
  ====================== */

  const visibleTabs = {
    ADMIN: [
      { id: "dashboard", label: "Dashboard" },
      { id: "farmers", label: "Farmers" },
      { id: "crops", label: "Crops" },
      { id: "batches", label: "Batches" },
      { id: "trace", label: "Trace" },
      { id: "distributor", label: "Distributor" },
      { id: "feedback", label: "Feedback" },
      { id: "contact", label: "Contact" },
    ],
    FARMER: [
      { id: "dashboard", label: "Dashboard" },
      { id: "farmers", label: "Farmers" },
      { id: "crops", label: "Crops" },
      { id: "batches", label: "Batches" },
      { id: "trace", label: "Trace" },
      { id: "feedback", label: "Feedback" },
      { id: "contact", label: "Contact" },
    ],
    DISTRIBUTOR: [
      { id: "dashboard", label: "Dashboard" },
      { id: "trace", label: "Trace" },
      { id: "distributor", label: "Profile" },
      { id: "feedback", label: "Feedback" },
      { id: "contact", label: "Contact" },
    ],
    CONSUMER: [
      { id: "dashboard", label: "Dashboard" },
      { id: "feedback", label: "Feedback" },
      { id: "contact", label: "Contact" },
    ],
  }[currentUser.role];

  /* ======================
     RENDER
  ====================== */

  return (
    <Layout
      tabs={visibleTabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      currentUser={currentUser}
      onLogout={handleLogout}
    >
      {activeTab === "dashboard" && currentUser.role === "ADMIN" && (
        <AdminDashboard users={users} farmers={farmers} crops={crops} batches={batches} />
      )}

     {activeTab === "dashboard" && currentUser.role === "FARMER" && (
  <FarmerDashboard
    currentUser={currentUser}
    crops={crops}
    batches={batches}
    traceRecords={traceRecords}
    distributors={distributors}   // ✅ REQUIRED
    getCropName={getCropName}
    
  />
)}
 

      {activeTab === "dashboard" && currentUser.role === "DISTRIBUTOR" && (
        <DistributorDashboard batches={batches} />
      )}

      {activeTab === "dashboard" && currentUser.role === "CONSUMER" && (
        <ConsumerDashboard
          currentUser={currentUser}
          batches={batches}
          getCropName={getCropName}
          getTraceForBatch={getTraceForBatch}
        />
      )}

      {activeTab === "farmers" && (
        <FarmersTab farmers={farmers} onAddFarmer={addFarmer} currentUser={currentUser} />
      )}

      {activeTab === "crops" && (
        <CropsTab crops={crops} farmers={farmers} onAddCrop={addCrop} currentUser={currentUser} />
      )}

      {activeTab === "batches" && (
        <BatchesTab batches={batches} crops={crops} farmers={farmers} onAddBatch={addBatch} currentUser={currentUser} />
      )}

      {activeTab === "trace" && (
        <TraceTab batches={batches} farmers={farmers} onAddTrace={addTraceRecord} getTraceForBatch={getTraceForBatch} currentUser={currentUser} />
      )}

      {activeTab === "distributor" && (
        <DistributorTab currentUser={currentUser} onUpdateDistributor={updateDistributor} />
      )}

      {activeTab === "feedback" && currentUser.role === "ADMIN" && <AdminFeedback />}
      {activeTab === "feedback" && currentUser.role !== "ADMIN" && <UserFeedback currentUser={currentUser} />}

      {activeTab === "contact" && currentUser.role !== "ADMIN" && <ContactTab currentUser={currentUser} />}
      {activeTab === "contact" && currentUser.role === "ADMIN" && <AdminContactTab />}
    </Layout>
  );
}

export default App;
