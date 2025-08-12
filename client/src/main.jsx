// Entry point of the React application
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // Main app component
import "./index.css"; // Global styles

// Get the root HTML element where React will mount
const container = document.getElementById("root");

// Create React root and render the app
const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);