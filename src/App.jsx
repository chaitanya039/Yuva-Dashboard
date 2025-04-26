// src/App.jsx
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar         from "./components/Sidebar";
import LoginPage       from "./containers/LoginPage";
import Unauthorized    from "./containers/Unauthorized";
import PrivateRoutes   from "./utils/PrivateRoutes";
import PublicRoute     from "./utils/PublicRoute";
import AnimatedRoutes  from "./components/AnimatedRoutes";
import ScrollToTop     from "./components/ScrollToTop";
import FullScreenLoader from "./components/FullScreenLoader";

// Helper to show loader only on login/logout
const AuthLoader = () => {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { pathname } = useLocation();

  // only show full-screen loader when on /login
  if (!pathname.startsWith("/login")) return null;
  return <FullScreenLoader loading={authLoading} />;
};

const App = () => {
  const { error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Router>
        <ScrollToTop />

        {/* full-screen overlay during login/logout */}
        <AuthLoader />

        <Routes>
          {/* PUBLIC */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* PROTECTED */}
          <Route element={<PrivateRoutes />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
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
