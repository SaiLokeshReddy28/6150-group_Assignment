// client/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

// Global CSS imports
import "./assets/css/main.css";
import "./assets/css/auth.css";
import "./assets/css/navigation.css";
import "./assets/css/dashboard.css";
import "./assets/css/budget.css";
import "./assets/css/upload.css";
import "./assets/css/insights.css";
import "./assets/css/welcome.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);