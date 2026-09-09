const CARRITO_KEY = "awsdcraft_carrito";

function obtenerCarrito() {
  const guardado = localStorage.getItem(CARRITO_KEY);
  if (!guardado) return [];
  try {
    return JSON.parse(guardado);
  } catch (error) {
    console.error("Carrito corrupto en localStorage, se reinicia.", error);
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function agregarAlCarrito(idProducto, cantidad = 1) {
  const producto = productos.find((p) => p.id === idProducto);
  if (!producto) return;

  const carrito = obtenerCarrito();
  const itemExistente = carrito.find((item) => item.id === idProducto);

  const cantidadActualEnCarrito = itemExistente ? itemExistente.cantidad : 0;
  if (cantidadActualEnCarrito + cantidad > producto.stock) {
    mostrarAvisoCarrito(`Solo quedan ${producto.stock} unidades de "${producto.nombre}".`, true);
    return;
  }

  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carrito.push({ id: idProducto, cantidad });
  }

  guardarCarrito(carrito);
  mostrarAvisoCarrito(`"${producto.nombre}" se agregó al carrito.`, false);
}

function quitarDelCarrito(idProducto) {
  const carrito = obtenerCarrito().filter((item) => item.id !== idProducto);
  guardarCarrito(carrito);
  if (typeof renderizarCarrito === "function") renderizarCarrito();
}

function actualizarCantidadCarrito(idProducto, nuevaCantidad) {
  const producto = productos.find((p) => p.id === idProducto);
  const carrito = obtenerCarrito();
  const item = carrito.find((i) => i.id === idProducto);
  if (!item || !producto) return;

  item.cantidad = Math.max(1, Math.min(nuevaCantidad, producto.stock));
  guardarCarrito(carrito);
  if (typeof renderizarCarrito === "function") renderizarCarrito();
}

function calcularTotalCarrito() {
  const carrito = obtenerCarrito();
  return carrito.reduce((total, item) => {
    const producto = productos.find((p) => p.id === item.id);
    return producto ? total + producto.precio * item.cantidad : total;
  }, 0);
}

function contarItemsCarrito() {
  return obtenerCarrito().reduce((total, item) => total + item.cantidad, 0);
}

function actualizarContadorCarrito() {
  const contador = document.getElementById("contadorCarrito");
  if (contador) contador.textContent = contarItemsCarrito();
}

function mostrarAvisoCarrito(mensaje, esError) {
  const existente = document.getElementById("avisoCarrito");
  if (existente) existente.remove();

  const aviso = document.createElement("div");
  aviso.id = "avisoCarrito";
  aviso.className = `alert ${esError ? "alert-danger" : "alert-success"} position-fixed shadow`;
  aviso.style.cssText = "top: 1rem; right: 1rem; z-index: 2000; min-width: 260px;";
  aviso.textContent = mensaje;
  document.body.appendChild(aviso);

  setTimeout(() => aviso.remove(), 2500);
}

document.addEventListener("click", (evento) => {
  const boton = evento.target.closest(".btn-agregar-carrito");
  if (!boton) return;
  const id = Number(boton.dataset.id);
  agregarAlCarrito(id, 1);
});

document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);