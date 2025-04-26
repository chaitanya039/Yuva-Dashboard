import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { user } = useSelector((state) => state.auth);
  
  console.log('User:', user); // Log the user object to ensure it's set correctly
  console.log('User Role:', user?.role); // Log the role to verify it's set

  // Check if user exists and their role is allowed
  if (!user || !allowedRoles.includes(user.role)) {
    console.log("Redirecting to unauthorized because role is not allowed.");
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};


export default RoleBasedRoute;