import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.js";
import "./styles/index.css";
import "core-js/stable";
import "regenerator-runtime";
import "regenerator-runtime/runtime";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
