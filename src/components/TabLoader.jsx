// src/components/TabLoader.jsx
import React from "react";
import { ClipLoader } from "react-spinners";

const TabLoader = ({ size = 30, color = "#3B82F6" }) => (
  <div className="flex items-center justify-center h-full">
    <ClipLoader size={size}  color={color} />
  </div>
);

export default TabLoader;
