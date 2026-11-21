export function formatearPrecio(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return "$ 0";
  return "$ " + numero.toLocaleString("es-CL");
}

export function precioConDescuento(producto) {
  if (!producto) return 0;
  // El backend ya envía el precio final calculado; se usa si está disponible.
  if (typeof producto.precioFinal === "number") return producto.precioFinal;
  if (!producto.descuento) return producto.precio;
  return Math.round(producto.precio * (1 - producto.descuento / 100));
}

export function formatearFechaHora(iso) {
  if (!iso) return "";
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return "";
  return fecha.toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" });
}

export function formatearFecha(iso) {
  if (!iso) return "";
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return "";
  return fecha.toLocaleDateString("es-CL");
}
