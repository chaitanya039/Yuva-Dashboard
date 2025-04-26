// src/components/FullScreenLoader.jsx
import { useSelector } from "react-redux";
import { isGlobalLoading } from "../features/isGlobalLoading";
import { ClipLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FullScreenLoader = () => {
  /* raw flag from Redux */
  const globalLoading = useSelector(isGlobalLoading);

  /* --- optional anti-flicker delay (150 ms) --- */
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let t;
    if (globalLoading) {
      t = setTimeout(() => setVisible(true), 150);   // show only if request >150 ms
    } else {
      setVisible(false);
    }
    return () => clearTimeout(t);
  }, [globalLoading]);

  /* --- UI --- */
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex items-center justify-center
                     bg-white/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <ClipLoader size={60} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullScreenLoader;
