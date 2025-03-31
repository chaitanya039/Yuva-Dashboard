import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRevenueByCity } from "../../features/analyticsSlice";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";

const HeatmapLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    const heatLayer = L.heatLayer(points, {
      radius: 30,
      blur: 20,
      maxZoom: 12,
      gradient: {
        0.2: "blue",
        0.4: "lime",
        0.6: "orange",
        0.8: "red",
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [points, map]);

  return null;
};

const RevenueByCityChart = () => {
  const dispatch = useDispatch();
  const { revenueByCity, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchRevenueByCity());
  }, [dispatch]);

  if (loading || !revenueByCity) return <div>Loading heatmap...</div>;

  const center = [20.5937, 78.9629]; // Center on India

  // 🔥 Normalize revenue using log scale
  const maxRevenue = Math.max(...revenueByCity.map((e) => e.revenue || 0));
  const maxLog = Math.log10(maxRevenue + 1);

  const heatPoints = revenueByCity
    .filter((entry) => entry.lat && entry.lng)
    .map((entry) => [
      entry.lat,
      entry.lng,
      Math.log10(entry.revenue + 1) / maxLog,
    ]);

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full h-[500px] relative">
    <h2 className="text-lg font-semibold mb-4">Order Revenue Heatmap</h2>
    <div className="w-full h-full">
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: "420px", width: "100%" }} // Ensure height is set
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
  
        {/* ✅ Render Heatmap Only When Data is Available */}
        {heatPoints?.length > 0 && <HeatmapLayer points={heatPoints} />}
  
        {/* 🧭 Circle markers with tooltips */}
        {revenueByCity.map((entry) =>
          entry.lat && entry.lng ? (
            <CircleMarker
              key={entry.city}
              center={[entry.lat, entry.lng]}
              radius={6}
              pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.6 }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent>
                <span className="text-xs font-semibold">
                  {entry.city}: ₹{entry.revenue.toLocaleString("en-IN")}
                </span>
              </Tooltip>
            </CircleMarker>
          ) : null
        )}
      </MapContainer>
    </div>
  </div>
  
  );
};

export default RevenueByCityChart;
