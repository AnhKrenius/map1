import React from "react";
import { useNavigate } from "react-router-dom";

const IntroPage = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/map");
  };

  const styles = {
    homepage: {
      height: "100vh",
      backgroundImage:
        "linear-gradient(rgba(36, 42, 46, 0.8), rgba(36, 42, 46, 0.8)), url('/bg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: "2.5rem 5rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    section: {
      display: "flex",
      flexDirection: "column",
      height: "85%",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    },
    h1: {
      fontSize: "3rem",
      color: "white",
      marginBottom: "1.5rem",
      animation: "fadeIn 0.4s ease-in-out", // Add fade-in animation
    },
    h2: {
      width: "90%",
      fontSize: "1.5rem",
      color: "white",
      marginBottom: "2.5rem",
      animation: "fadeIn 0.9s ease-in-out", // Add fade-in animation with delay
    },
    button: {
      padding: "10px 20px",
      fontSize: "16px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "20px",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    // Add keyframes for animations
    "@keyframes fadeIn": {
      "0%": {
        opacity: 0,
        transform: "translateY(20px)",
      },
      "100%": {
        opacity: 1,
        transform: "translateY(0)",
      },
    },
  };

  // Dynamically inject keyframes into the document
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(
    `@keyframes fadeIn { 
      0% { opacity: 0; transform: translateY(20px); } 
      100% { opacity: 1; transform: translateY(0); } 
    }`,
    styleSheet.cssRules.length
  );

  return (
    <div style={styles.homepage}>
      <section style={styles.section}>
        <h1 style={styles.h1}>Welcome to the Australian Suburbs Map</h1>
        <h2 style={styles.h2}>
          Explore the map to view detailed information about Australian suburbs.
        </h2>
        <button
          onClick={handleButtonClick}
          style={styles.button}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor =
              styles.buttonHover.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = styles.button.backgroundColor)
          }
        >
          Go to Map
        </button>
      </section>
    </div>
  );
};

export default IntroPage;
