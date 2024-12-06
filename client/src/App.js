import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const MapPage = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/suburb2.geojson")
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonData(data);
        setFilteredData(data);
      })
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, []);

  const handleSearch = () => {
    if (!mapRef.current) {
      console.error("Map instance is not available.");
      return;
    }

    if (geoJsonData) {
      const term = searchTerm.toLowerCase();
      const matchingFeatures = geoJsonData.features.filter((feature) =>
        feature.properties.nsw_loca_2.toLowerCase().includes(term)
      );

      if (matchingFeatures.length > 0) {
        const filtered = {
          ...geoJsonData,
          features: matchingFeatures,
        };
        setFilteredData(filtered);

        // Fly to the bounds of the first matching feature
        const layer = L.geoJSON(matchingFeatures[0]);
        const bounds = layer.getBounds();
        mapRef.current.fitBounds(bounds); // Safely adjust the map's view
      } else {
        alert("No matching suburbs found!");
      }
    }
  };

  const capitalizeSuburb = (suburb) =>
    suburb
      ? suburb
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ")
      : "Unnamed Suburb";

  const getPopupContent = (feature) => {
    const { nsw_loca_2, lc_ply_pid, dt_create, nsw_loca_1, nsw_loca_5 } =
      feature.properties;
    return `<div>
        <h4>Suburb: ${capitalizeSuburb(nsw_loca_2)}</h4>
        <p><strong>Location ID:</strong> ${nsw_loca_1 || "N/A"}</p>
        <p><strong>LC Poly PID:</strong> ${lc_ply_pid || "N/A"}</p>
        <p><strong>Date Created:</strong> ${dt_create || "N/A"}</p>
        <p><strong>Region:</strong> ${nsw_loca_5 || "N/A"}</p>
      </div>`;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Australian Suburbs Map</h1>
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Enter suburb name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchBar}
        />
        <button onClick={handleSearch} style={styles.searchButton}>
          Search
        </button>
      </div>

      <MapContainer
        center={[-33.8688, 151.2093]} // Initial map center (Sydney)
        zoom={10} // Zoom level
        style={styles.map}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance; // Set the map instance reference
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {filteredData && (
          <GeoJSON
            data={filteredData}
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
      <button onClick={() => navigate("/")} style={styles.button}>
        Return to Home
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f4f6f9",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    margin: "1.5 rem",
  },
  searchBar: {
    padding: "10px",
    fontSize: "16px",
    width: "300px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    outline: "none",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  searchButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s, transform 0.2s ease-in-out",
  },
  button: {
    padding: "12px 24px",
    fontSize: "0.8rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    margin: "20px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s, transform 0.2s ease-in-out",
  },
  title: {
    fontSize: "2rem",
    color: "#333",
    fontWeight: "700",
    marginBottom: "1rem",
    textShadow: "2px 2px 6px rgba(0, 0, 0, 0.3)",
  },
  map: {
    height: "600px",
    width: "100%",
    borderRadius: "15px",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
    marginTop: "20px",
  },
};

export default MapPage;
