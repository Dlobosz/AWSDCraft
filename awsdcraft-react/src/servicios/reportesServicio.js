import api from "./api";

/** GET /reportes/resumen (solo ADMIN): indicadores de ventas e inventario. */
export async function obtenerResumen() {
  const { data } = await api.get("/reportes/resumen");
  return data;
}
