export function formatearPrecio(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return "$ 0";
  return "$ " + numero.toLocaleString("es-CL");
}

export function precioConDescuento(producto) {
  if (!producto || !producto.descuento) return producto ? producto.precio : 0;
  return Math.round(producto.precio * (1 - producto.descuento / 100));
}

export function formatearFecha(iso) {
  if (!iso) return "";
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return "";
  return fecha.toLocaleDateString("es-CL");
}
