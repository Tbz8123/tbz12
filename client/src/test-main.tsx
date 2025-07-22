import React from "react";
import { createRoot } from "react-dom/client";

// Simple test component to check if React is working
function TestApp() {
  return (
    <div style={{ 
      padding: "20px", 
      backgroundColor: "white", 
      color: "black", 
      fontSize: "24px",
      fontFamily: "Arial"
    }}>
      <h1>React Test - TbzResumeBuilder</h1>
      <p>If you can see this, React is working correctly!</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}

// Add error handling
try {
  console.log("Starting React application...");
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("Root element not found!");
    document.body.innerHTML = "<h1>Error: Root element not found</h1>";
  } else {
    console.log("Root element found, creating React root...");
    const root = createRoot(rootElement);
    console.log("React root created, rendering app...");
    root.render(<TestApp />);
    console.log("App rendered successfully!");
  }
} catch (error) {
  console.error("Error starting React app:", error);
  document.body.innerHTML = `<h1>Error starting app: ${error.message}</h1>`;
}