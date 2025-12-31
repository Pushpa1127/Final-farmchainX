import React from "react";
import FarmerDashboard from "./dashboards/FarmerDashboard";
import DistributorDashboard from "./dashboards/DistributorDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";
import ConsumerDashboard from "./dashboards/ConsumerDashboard";

function Dashboard({
  currentUser,
  farmers = [],
  crops = [],
  batches = [],
  traceRecords = [],
  getCropName,
  getFarmerName,
}) {
  if (!currentUser || !currentUser.role) {
    return <p>Loading dashboard...</p>;
  }

  switch (currentUser.role) {
    case "FARMER":
      return (
        <FarmerDashboard
          currentUser={currentUser}
          crops={crops}
          batches={batches}
          traceRecords={traceRecords}
          getCropName={getCropName}
        />
      );

    case "DISTRIBUTOR":
      return (
        <DistributorDashboard
          currentUser={currentUser}
          batches={batches}
          getCropName={getCropName}
          getFarmerName={getFarmerName}
        />
      );

    case "ADMIN":
      return (
        <AdminDashboard
          currentUser={currentUser}
          farmers={farmers}
          crops={crops}
          batches={batches}
          traceRecords={traceRecords}
        />
      );

    case "CONSUMER":
      return (
        <ConsumerDashboard
          currentUser={currentUser}
          batches={batches}
          getCropName={getCropName}
          getFarmerName={getFarmerName}
        />
      );

    default:
      return <p>Role not recognized</p>;
  }
}

export default Dashboard;
