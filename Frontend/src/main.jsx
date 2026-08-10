import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import AuthProvider from "./context/AuthProvider";
import { SettingsProvider } from "./context/SettingsContext";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <SettingsProvider>
      <Toaster theme="dark" richColors position="top-right" closeButton duration={3000} />
      <App />
      </SettingsProvider>
    </AuthProvider>
  </React.StrictMode>,
);
