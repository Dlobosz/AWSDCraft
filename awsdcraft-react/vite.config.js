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
    // npm run test:coverage: informe de cobertura en la carpeta coverage/ (no se sube a git)
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/componentes/**", "src/servicios/**", "src/utilidades/**", "src/contexto/**", "src/hooks/**"],
    },
  },
});
