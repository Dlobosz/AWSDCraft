import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/pruebas/configuracion.js",
    include: ["src/pruebas/**/*.test.jsx"],
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
      include: ["src/componentes/**", "src/servicios/**", "src/utilidades/**"],
    },
  },
});
