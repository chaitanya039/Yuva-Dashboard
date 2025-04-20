import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { loadUser } from "../features/authSlice";

const PrivateRoutes = () => {
  // const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (!user) {
  //     dispatch(loadUser());
  //   }
  // }, [dispatch, user]);

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <ClipLoader size={40} color="#3B82F6" />
  //     </div>
  //   );
  // }

  // if (!isAuthenticated || !user) {
  //   return <Navigate to="/login" replace />;
  // }

  return <Outlet />;
};

export default PrivateRoutes;