import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import { fetchCustomerDistribution } from "../../features/analyticsSlice";

import "./HeatmapStyles.css"; // Custom marker style

const HeatmapLayer = ({ points, originalData }) => {
  const map = useMap();

  useEffect(() => {
    const heat = L.heatLayer(points, {
      radius: 40,
      blur: 30,
      maxZoom: 12,
      minOpacity: 0.5,
      gradient: {
        0.2: "blue",
        0.4: "lime",
        0.6: "orange",
        0.8: "red",
        1.0: "darkred",
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [points, map]);

  return (
    <>
      {originalData.map(
        (c, index) =>
          c.lat &&
          c.lng && (
            <Marker
              key={index}
              position={[c.lat, c.lng]}
              icon={L.divIcon({
                className: `custom-marker ${c.type?.toLowerCase()}`,
              })}
            >
              <Tooltip
                permanent
                direction="top"
                offset={[0, -10]}
                className="tooltip-box"
              >
                <span>
                  <strong>{c.name || "Customer"}</strong>
                  <br />
                  {c.type || "Unknown"}
                </span>
              </Tooltip>
            </Marker>
          )
      )}
    </>
  );
};

const CustomerDistributionMap = () => {
  const dispatch = useDispatch();
  const { customerDistribution, loading } = useSelector(
    (state) => state.analytics
  );

  useEffect(() => {
    dispatch(fetchCustomerDistribution());
  }, [dispatch]);

  if (loading || !customerDistribution)
    return <div className="text-sm text-gray-500">Loading map...</div>;

  const heatPoints = customerDistribution
    .filter((c) => c.lat && c.lng)
    .map((c) => [c.lat, c.lng, 1]);

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full h-[500px] overflow-hidden">
      <h2 className="text-lg font-semibold mb-4">
        Customer Distribution Heatmap
      </h2>
      <div className="w-full h-full rounded overflow-hidden">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <HeatmapLayer
            points={heatPoints}
            originalData={customerDistribution}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default CustomerDistributionMap;
