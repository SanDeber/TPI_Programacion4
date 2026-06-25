import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";

// Punto de entrada: monta <App /> dentro de:
// - BrowserRouter: habilita la navegación entre páginas (rutas)
// - AuthProvider: contexto global que guarda el usuario logueado
//   y el token JWT, para que cualquier página pueda consultarlo.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
