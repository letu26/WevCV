import { getAccessToken, hasRole } from "@/util/auth";
import React from "react";
import { Navigate, Outlet } from "react-router";

const UserRoute = () => {
  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default UserRoute;
