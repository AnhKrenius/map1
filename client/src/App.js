import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  // Fetch the GeoJSON data from the public folder
  useEffect(() => {
    fetch("/suburb2.geojson")
      .then((response) => response.json())
      .then((data) => setGeoJsonData(data))
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, []);

  // Function to create a detailed popup content
  const getPopupContent = (feature) => {
    const { nsw_loca_2, lc_ply_pid, dt_create, nsw_loca_1, nsw_loca_5 } = feature.properties;
    return (
      `<div>
        <h4>Suburb: ${nsw_loca_2 || "Unnamed Suburb"}</h4>
        <p><strong>Location ID:</strong> ${nsw_loca_1 || "N/A"}</p>
        <p><strong>LC Poly PID:</strong> ${lc_ply_pid || "N/A"}</p>
        <p><strong>Date Created:</strong> ${dt_create || "N/A"}</p>
        <p><strong>Region:</strong> ${nsw_loca_5 || "N/A"}</p>
      </div>`
    );
  };

  return (
    <div>
      <h1>Australian Suburbs Map</h1>
      <MapContainer
        center={[-33.8688, 151.2093]} // Initial map center (Sydney)
        zoom={10} // Zoom level
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
            style={() => ({
              color: "blue",
              weight: 2,
              fillColor: "lightblue",
              fillOpacity: 0.5,
            })}
            onEachFeature={(feature, layer) => {
              layer.bindPopup(getPopupContent(feature));
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default App;
