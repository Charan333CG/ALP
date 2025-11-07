import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

console.log("✅ React app started rendering...");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
