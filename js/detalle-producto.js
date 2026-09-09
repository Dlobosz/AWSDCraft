document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("detalleProducto");
  if (!contenedor) return;

  const parametros = new URLSearchParams(window.location.search);
  const idProducto = Number(parametros.get("id"));
  const producto = productos.find((p) => p.id === idProducto);

  if (!producto) {
    contenedor.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-secondary mb-3">No encontramos ese producto.</p>
        <a href="productos.html" class="btn btn-awsd">Volver al catálogo</a>
      </div>`;
    return;
  }

  document.title = `${producto.nombre} | AWSDCraft.cl`;
  document.getElementById("breadcrumbNombre").textContent = producto.nombre;

  const sinStock = producto.stock === 0;

  contenedor.innerHTML = `
    <div class="col-md-6">
      <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid rounded-4 border" style="border-color: var(--awsd-border) !important;">
    </div>
    <div class="col-md-6">
      <span class="section-kicker">${producto.categoria}</span>
      <h1 class="awsd-title h3">${producto.nombre}</h1>
      <p class="product-price fs-3">${formatearPrecio(producto.precio)}</p>
      <p class="text-secondary">${producto.descripcion}</p>
      <p class="small text-secondary mb-1"><strong>Switch:</strong> ${producto.switch}</p>
      <p class="small ${producto.stock <= producto.stockCritico ? "text-danger" : "text-secondary"} mb-4">
        ${sinStock ? "Sin stock disponible" : `Stock disponible: ${producto.stock} unidades`}
      </p>

      <div class="d-flex align-items-center gap-3 mb-4">
        <label for="inputCantidad" class="form-label mb-0">Cantidad</label>
        <div class="qty-control">
          <button type="button" id="btnMenos" aria-label="Restar una unidad">−</button>
          <input type="number" id="inputCantidad" value="1" min="1" max="${producto.stock}" aria-label="Cantidad">
          <button type="button" id="btnMas" aria-label="Sumar una unidad">+</button>
        </div>
      </div>

      <button class="btn btn-awsd btn-lg" id="btnAgregarDetalle" type="button" ${sinStock ? "disabled" : ""}>
        <i class="bi bi-cart-plus me-2"></i>Añadir al carrito
      </button>
    </div>
  `;

  const inputCantidad = document.getElementById("inputCantidad");
  document.getElementById("btnMenos").addEventListener("click", () => {
    inputCantidad.value = Math.max(1, Number(inputCantidad.value) - 1);
  });
  document.getElementById("btnMas").addEventListener("click", () => {
    inputCantidad.value = Math.min(producto.stock, Number(inputCantidad.value) + 1);
  });

  document.getElementById("btnAgregarDetalle")?.addEventListener("click", () => {
    const cantidad = Math.max(1, Math.min(Number(inputCantidad.value), producto.stock));
    agregarAlCarrito(producto.id, cantidad);
  });

  const relacionadosContainer = document.getElementById("relacionadosContainer");
  const relacionados = productos
    .filter((p) => p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 4);

  relacionadosContainer.innerHTML = relacionados.length
    ? relacionados.map((p) => crearTarjetaProducto(p, "")).join("")
    : `<p class="text-secondary">No hay más productos en esta categoría por ahora.</p>`;
});