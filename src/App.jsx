// ✅ Updated App.jsx with all role-based functionality
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./components/Sidebar";
import LoginPage from "./containers/LoginPage";
import Unauthorized from "./containers/Unauthorized";
import PrivateRoutes from "./utils/PrivateRoutes";
import AnimatedRoutes from "./components/AnimatedRoutes";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <ClipLoader size={50} color="#3B82F6" />
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Admin Layout for All Roles */}
          <Route
            element={<PrivateRoutes allowedRoles={["Admin", "Sales", "InventoryManager"]} />}
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route
              path="*"
              element={
                <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto mt-[10px] lg:mt-0 p-4 md:p-6 lg:p-8 relative">
                    <AnimatedRoutes />
                  </main>
                </div>
              }
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
