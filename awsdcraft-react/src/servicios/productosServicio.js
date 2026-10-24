import { productos as semilla } from "../datos/productos";
import { CLAVES, guardar, iniciarColeccion, proximoId } from "./almacenamiento";

export function listarProductos() {
  return iniciarColeccion(CLAVES.productos, semilla);
}

export function obtenerProducto(id) {
  return listarProductos().find((producto) => producto.id === Number(id)) || null;
}

export function crearProducto(datos) {
  const lista = listarProductos();
  const nuevo = { ...datos, id: proximoId(lista) };
  const actualizada = [...lista, nuevo];
  guardar(CLAVES.productos, actualizada);
  return nuevo;
}

export function actualizarProducto(id, datos) {
  const lista = listarProductos();
  const actualizada = lista.map((producto) =>
    producto.id === Number(id) ? { ...producto, ...datos, id: Number(id) } : producto
  );
  guardar(CLAVES.productos, actualizada);
  return actualizada.find((producto) => producto.id === Number(id)) || null;
}

export function eliminarProducto(id) {
  const lista = listarProductos();
  const actualizada = lista.filter((producto) => producto.id !== Number(id));
  guardar(CLAVES.productos, actualizada);
  return actualizada;
}

export function listarDestacados() {
  return listarProductos().filter((producto) => producto.destacado);
}

export function listarOfertas() {
  return listarProductos().filter((producto) => producto.descuento > 0);
}

export function listarPorCategoria(slug) {
  return listarProductos().filter((producto) => producto.categoria === slug);
}

export function listarCriticos() {
  return listarProductos().filter((producto) => producto.stock <= producto.stockCritico);
}

export function buscarProductos(lista, termino) {
  const texto = String(termino || "").trim().toLowerCase();
  if (texto === "") return lista;
  return lista.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(texto) ||
      producto.codigo.toLowerCase().includes(texto)
  );
}

export function descontarStock(items) {
  const lista = listarProductos();
  const actualizada = lista.map((producto) => {
    const item = items.find((linea) => linea.id === producto.id);
    if (!item) return producto;
    return { ...producto, stock: Math.max(0, producto.stock - item.cantidad) };
  });
  guardar(CLAVES.productos, actualizada);
  return actualizada;
}
