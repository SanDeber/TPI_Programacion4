import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuración de Vite.
// - El plugin de React habilita JSX + Fast Refresh.
// - El bloque "server.proxy" redirige cualquier request que el frontend
//   haga a "/api/..." hacia el backend de Spring Boot (puerto 8080).
//   Esto evita problemas de CORS durante el desarrollo: el navegador
//   ve todo como si viniera del mismo origen (localhost:5173).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
