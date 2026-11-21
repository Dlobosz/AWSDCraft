import api from "./api";

// Endpoints REST de /api/v1/boletas (órdenes de compra).

const CLAVE_ULTIMA_BOLETA = "awsdcraft_ultima_boleta";

/** POST /boletas: el backend calcula precios, valida y descuenta stock. */
export async function crearOrden(orden) {
  const { data } = await api.post("/boletas", orden);
  guardarUltimaBoleta(data);
  return data;
}

/** GET /boletas (ADMIN y VENDEDOR). Filtro opcional por estado. */
export async function listarOrdenes(estado) {
  const { data } = await api.get("/boletas", { params: estado ? { estado } : {} });
  return data;
}

/** GET /boletas/mis-boletas: compras del usuario autenticado. */
export async function listarMisOrdenes() {
  const { data } = await api.get("/boletas/mis-boletas");
  return data;
}

export async function obtenerOrden(id) {
  const { data } = await api.get(`/boletas/${id}`);
  return data;
}

/** PATCH /boletas/{id}/estado (solo ADMIN). */
export async function cambiarEstadoOrden(id, estado) {
  const { data } = await api.patch(`/boletas/${id}/estado`, { estado });
  return data;
}

/** DELETE /boletas/{id} (solo ADMIN, boletas rechazadas o anuladas). */
export async function eliminarOrden(id) {
  await api.delete(`/boletas/${id}`);
}

// La última boleta se recuerda en la pestaña para que la página de pago exitoso/rechazado
// pueda recargarse aunque la compra se haya hecho como invitado.
export function guardarUltimaBoleta(boleta) {
  sessionStorage.setItem(CLAVE_ULTIMA_BOLETA, JSON.stringify(boleta));
}

export function leerUltimaBoleta(id) {
  try {
    const boleta = JSON.parse(sessionStorage.getItem(CLAVE_ULTIMA_BOLETA));
    return boleta && String(boleta.id) === String(id) ? boleta : null;
  } catch {
    return null;
  }
}
