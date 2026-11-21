import api from "./api";

// Cada función corresponde a un endpoint REST de /api/v1/productos.

/** GET /productos con filtros opcionales: { categoria, q, destacados, ofertas }. */
export async function listarProductos(filtros = {}) {
  const { data } = await api.get("/productos", { params: filtros });
  return data;
}

export const listarDestacados = () => listarProductos({ destacados: true });

export const listarOfertas = () => listarProductos({ ofertas: true });

export const listarPorCategoria = (slug) => listarProductos({ categoria: slug });

/** GET /productos/criticos (solo ADMIN). */
export async function listarCriticos() {
  const { data } = await api.get("/productos/criticos");
  return data;
}

export async function obtenerProducto(id) {
  const { data } = await api.get(`/productos/${id}`);
  return data;
}

/** POST /productos (solo ADMIN). */
export async function crearProducto(producto) {
  const { data } = await api.post("/productos", producto);
  return data;
}

/** PUT /productos/{id} (solo ADMIN). */
export async function actualizarProducto(id, producto) {
  const { data } = await api.put(`/productos/${id}`, producto);
  return data;
}

/** DELETE /productos/{id} (solo ADMIN). */
export async function eliminarProducto(id) {
  await api.delete(`/productos/${id}`);
}

/** Filtro local por nombre o código (no llama a la API: se aplica sobre una lista ya cargada). */
export function buscarProductos(lista, termino) {
  const texto = String(termino || "").trim().toLowerCase();
  if (texto === "") return lista;
  return lista.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(texto) ||
      producto.codigo.toLowerCase().includes(texto)
  );
}
