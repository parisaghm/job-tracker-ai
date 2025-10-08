
import React from "react";
import { Navigate } from "react-router-dom";

// Redirect the root path to the dashboard
const Index = () => {
  return <Navigate to="/dashboard" replace />;
};

export default Index;
