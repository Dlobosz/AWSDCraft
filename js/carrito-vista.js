function renderizarCarrito() {
  const contenedor = document.getElementById("listaCarrito");
  if (!contenedor) return;

  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    contenedor.innerHTML = `
      <div class="cart-empty">
        <i class="bi bi-cart-x fs-1 d-block mb-3"></i>
        <p class="mb-3">Tu carrito está vacío.</p>
        <a href="productos.html" class="btn btn-awsd">Ver productos</a>
      </div>`;
    document.getElementById("subtotalCarrito").textContent = formatearPrecio(0);
    document.getElementById("totalCarrito").textContent = formatearPrecio(0);
    return;
  }
  contenedor.innerHTML = carrito
    .map((item) => {
      const producto = productos.find((p) => p.id === item.id);
      if (!producto) return "";
      const subtotalItem = producto.precio * item.cantidad;

      return `
        <div class="awsd-card p-3 d-flex align-items-center gap-3">
          <img src="${producto.imagen}" alt="${producto.nombre}" class="cart-item-img">
          <div class="flex-grow-1">
            <h3 class="h6 mb-1">${producto.nombre}</h3>
            <p class="small text-secondary mb-2">${formatearPrecio(producto.precio)} c/u</p>
            <div class="qty-control">
              <button type="button" class="btn-restar" data-id="${producto.id}" aria-label="Restar una unidad">−</button>
              <input type="number" class="input-cantidad-carrito" data-id="${producto.id}"
                value="${item.cantidad}" min="1" max="${producto.stock}" aria-label="Cantidad">
              <button type="button" class="btn-sumar" data-id="${producto.id}" aria-label="Sumar una unidad">+</button>
            </div>
          </div>
          <div class="text-end">
            <p class="product-price mb-2">${formatearPrecio(subtotalItem)}</p>
            <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${producto.id}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>`;
    })
    .join("");

    const total = calcularTotalCarrito();
    document.getElementById("totalCarrito").textContent = formatearPrecio(total);
    document.getElementById("subtotalCarrito").textContent = formatearPrecio(total);
}

document.addEventListener("DOMContentLoaded", renderizarCarrito);
document.addEventListener("click", (evento) => {
  const btnSumar = evento.target.closest(".btn-sumar");
  const btnRestar = evento.target.closest(".btn-restar");
  const btnEliminar = evento.target.closest(".btn-eliminar");

  if (btnSumar) {
    const id = Number(btnSumar.dataset.id);
    const carrito = obtenerCarrito();
    const item = carrito.find((i) => i.id === id);
    if (item) actualizarCantidadCarrito(id, item.cantidad + 1);
  }

  if (btnRestar) {
    const id = Number(btnRestar.dataset.id);
    const carrito = obtenerCarrito();
    const item = carrito.find((i) => i.id === id);
    if (item) actualizarCantidadCarrito(id, item.cantidad - 1);
  }

  if (btnEliminar) {
    quitarDelCarrito(Number(btnEliminar.dataset.id));
  }
});

document.addEventListener("change", (evento) => {
  if (evento.target.matches(".input-cantidad-carrito")) {
    const id = Number(evento.target.dataset.id);
    actualizarCantidadCarrito(id, Number(evento.target.value));
  }
});

document.addEventListener("click", (evento) => {
  if (evento.target.closest("#btnPagar")) {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
      mostrarAvisoCarrito("Tu carrito está vacío.", true);
      return;
    }

    localStorage.removeItem(CARRITO_KEY);
    mostrarAvisoCarrito("¡Compra simulada con éxito! Gracias por tu pedido.", false);
    setTimeout(renderizarCarrito, 300);
    setTimeout(actualizarContadorCarrito, 300);
  }
});