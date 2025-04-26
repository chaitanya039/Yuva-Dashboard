// src/components/FullScreenLoader.jsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeLoader } from "react-spinners";

/*
  FullScreenLoader
  ─────────────────────────────────────────────────────────
  Props
    loading        boolean            – show/hide loader
    cover          "screen" | "parent" – "screen" (default) uses fixed inset-0; 
                                          "parent" uses absolute inset-0 to fill nearest relative
    delay          number             – debounce before showing (ms, default 120)
    backdropClass  string             – extra Tailwind/CSS classes on backdrop
    color          string             – spinner color (default #3B82F6)
    height         number             – bar height px (default 12)
    width          number             – bar width px (default 4)
    margin         number             – gap between bars px (default 2)
*/

const FullScreenLoader = ({
  loading,
  cover = "screen",
  delay = 120,
  backdropClass = "",
  color = "#3B82F6",
  height = 12,
  width = 4,
  margin = 2,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => setVisible(true), delay);
    } else {
      setVisible(false);
    }
    return () => clearTimeout(timer);
  }, [loading, delay]);

  // choose fixed or absolute based on `cover`
  const containerClass =
    cover === "screen"
      ? "fixed inset-0 z-[9999] flex items-center justify-center"
      : "absolute inset-0 z-40 flex items-center justify-center";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="fs-loader"
          className={`${containerClass} bg-white/75 backdrop-blur-md ${backdropClass}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <FadeLoader
            color={color}
            height={height}
            width={width}
            margin={margin}
            speedMultiplier={1.1}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullScreenLoader;
