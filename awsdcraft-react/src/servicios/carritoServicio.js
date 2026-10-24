import { precioConDescuento } from "../utilidades/formato";

export function agregarItem(carrito, producto, cantidad = 1) {
  const existente = carrito.find((item) => item.id === producto.id);
  const cantidadActual = existente ? existente.cantidad : 0;
  const permitida = Math.min(cantidadActual + cantidad, producto.stock);

  if (permitida === cantidadActual) return carrito;

  if (existente) {
    return carrito.map((item) =>
      item.id === producto.id ? { ...item, cantidad: permitida } : item
    );
  }

  return [
    ...carrito,
    {
      id: producto.id,
      nombre: producto.nombre,
      imagen: producto.imagen,
      precio: precioConDescuento(producto),
      stock: producto.stock,
      cantidad: permitida,
    },
  ];
}

export function quitarItem(carrito, id) {
  return carrito.filter((item) => item.id !== id);
}

export function cambiarCantidad(carrito, id, cantidad) {
  return carrito.map((item) => {
    if (item.id !== id) return item;
    const nueva = Math.max(1, Math.min(Number(cantidad) || 1, item.stock));
    return { ...item, cantidad: nueva };
  });
}

export function calcularTotal(carrito) {
  return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

export function contarItems(carrito) {
  return carrito.reduce((total, item) => total + item.cantidad, 0);
}
