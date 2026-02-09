import { getAccessToken, hasRole } from "@/util/auth";
import React from "react";
import { Navigate, Outlet } from "react-router";

const LeadRoute = () => {
  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/lead/login" replace />;
  }

  if (!hasRole(["ADMIN", "LEAD"])) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default LeadRoute;
