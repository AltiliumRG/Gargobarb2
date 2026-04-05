// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { BarberProvider } from "./context/BarberContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="820070306319-o6pmp2mdhrkpdabhd0uh4mb6fjsqn5fu.apps.googleusercontent.com">
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <BarberProvider>
              <NotificationProvider>
                <App />
              </NotificationProvider>
            </BarberProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
