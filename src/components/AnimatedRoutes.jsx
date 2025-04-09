// components/AnimatedRoutes.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Import your pages
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/inventory" element={<InventoryDashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/payments" element={<PaymentAnalysis />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
