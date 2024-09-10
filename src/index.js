import React from "react";
import ReactDOM from "react-dom/client";  // Usa el nuevo import de 'react-dom/client'
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));  // Crea el root de React
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
