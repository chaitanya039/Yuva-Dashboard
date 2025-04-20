import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ allowedRoles, children }) => {
  // const { user } = useSelector((state) => state.auth);

  // if (!user || !allowedRoles.includes(user.role)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return children;
};

export default RoleBasedRoute;