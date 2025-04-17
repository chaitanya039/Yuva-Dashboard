import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import RoleBasedRoute from "../utils/RoleBasedRoutes";

// Import pages
import Dashboard from "../containers/Dashboard";
import Products from "../containers/Products";
import Categories from "../containers/Categories";
import Customers from "../containers/Customers";
import OrdersPage from "../containers/OrdersPage";
import InventoryDashboard from "../containers/InventoryDashboard";
import Expenses from "../containers/Expenses";
import Analytics from "../containers/Analytics";
import PaymentAnalysis from "../containers/PaymentAnalysis";
import Reports from "../containers/Reports";
import Users from "../containers/Users";

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/dashboard" element={
            <RoleBasedRoute allowedRoles={["Admin", "Sales", "InventoryManager"]}><Dashboard /></RoleBasedRoute>
          } />
          <Route path="/products" element={
            <RoleBasedRoute allowedRoles={["Admin", "InventoryManager"]}><Products /></RoleBasedRoute>
          } />
          <Route path="/categories" element={
            <RoleBasedRoute allowedRoles={["Admin", "InventoryManager"]}><Categories /></RoleBasedRoute>
          } />
          <Route path="/users" element={
            <RoleBasedRoute allowedRoles={["Admin"]}><Users /></RoleBasedRoute>
          } />
          <Route path="/customers" element={
            <RoleBasedRoute allowedRoles={["Admin", "Sales"]}><Customers /></RoleBasedRoute>
          } />
          <Route path="/orders" element={
            <RoleBasedRoute allowedRoles={["Admin", "Sales"]}><OrdersPage /></RoleBasedRoute>
          } />
          <Route path="/inventory" element={
            <RoleBasedRoute allowedRoles={["Admin", "InventoryManager"]}><InventoryDashboard /></RoleBasedRoute>
          } />
          <Route path="/expenses" element={
            <RoleBasedRoute allowedRoles={["Admin", "InventoryManager"]}><Expenses /></RoleBasedRoute>
          } />
          <Route path="/analytics" element={
            <RoleBasedRoute allowedRoles={["Admin"]}><Analytics /></RoleBasedRoute>
          } />
          <Route path="/payments" element={
            <RoleBasedRoute allowedRoles={["Admin", "Sales"]}><PaymentAnalysis /></RoleBasedRoute>
          } />
          <Route path="/reports" element={
            <RoleBasedRoute allowedRoles={["Admin"]}><Reports /></RoleBasedRoute>
          } />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;