import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
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
import DashboardContainer from "./containers/DashboardContainer";

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
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoutes allowedRoles={["Admin"]} />}>
            <Route
              path="/"
              element={
                <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto mt-[10px] lg:mt-0">
                    <DashboardContainer />
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
