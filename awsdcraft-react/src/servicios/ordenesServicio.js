import { CLAVES, guardar, leer, proximoId } from "./almacenamiento";

export function listarOrdenes() {
  return leer(CLAVES.ordenes, []);
}

export function obtenerOrden(id) {
  return listarOrdenes().find((orden) => orden.id === Number(id)) || null;
}

export function crearOrden(datos) {
  const lista = listarOrdenes();
  const id = proximoId(lista);
  const nueva = {
    ...datos,
    id,
    codigo: "ORDEN" + String(10000 + id),
    fecha: new Date().toISOString(),
  };
  guardar(CLAVES.ordenes, [...lista, nueva]);
  return nueva;
}

export function actualizarOrden(id, datos) {
  const lista = listarOrdenes();
  const actualizada = lista.map((orden) =>
    orden.id === Number(id) ? { ...orden, ...datos, id: Number(id) } : orden
  );
  guardar(CLAVES.ordenes, actualizada);
  return actualizada.find((orden) => orden.id === Number(id)) || null;
}

export function eliminarOrden(id) {
  const lista = listarOrdenes();
  const actualizada = lista.filter((orden) => orden.id !== Number(id));
  guardar(CLAVES.ordenes, actualizada);
  return actualizada;
}

export function listarOrdenesDeCorreo(correo) {
  const texto = String(correo || "").toLowerCase();
  return listarOrdenes().filter((orden) => String(orden.correo).toLowerCase() === texto);
}

export function totalVendido() {
  return listarOrdenes()
    .filter((orden) => orden.estado === "Pagada")
    .reduce((suma, orden) => suma + orden.total, 0);
}
