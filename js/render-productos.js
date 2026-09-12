function formatearPrecio(valor) {
  return "$" + valor.toLocaleString("es-CL");
}
                            
function crearTarjetaProducto(producto, prefijoEnlace) {
  const detalleUrl = `${prefijoEnlace}detalle-producto.html?id=${producto.id}`;
  const sinStock = producto.stock === 0;
  const raizImg = prefijoEnlace === "pages/" ? "" : "../";
  const srcImagen = `${raizImg}img/${producto.imagen}`;

  return `
    <article class="col-6 col-md-4 col-lg-3">
      <div class="product-card">
        <a href="${detalleUrl}">
          <img src="${srcImagen}" alt="${producto.nombre}">
        </a>
        <div class="product-body">
          <a href="${detalleUrl}" class="text-decoration-none text-reset">
            <h3 class="h6 mb-1">${producto.nombre}</h3>
          </a>
          <p class="small text-secondary mb-2">${producto.switch !== "N/A" ? producto.switch : producto.categoria}</p>
          ${producto.stock <= producto.stockCritico && !sinStock
            ? `<p class="small text-danger mb-2"><i class="bi bi-exclamation-triangle me-1"></i>¡Últimas unidades! (${producto.stock})</p>`
            : ""}
          ${sinStock ? `<p class="small text-danger mb-2">Sin stock</p>` : ""}
          <div class="d-flex justify-content-between align-items-center">
            <span class="product-price">${formatearPrecio(producto.precio)}</span>
            <button class="btn btn-sm btn-awsd btn-agregar-carrito" type="button"
              data-id="${producto.id}" ${sinStock ? "disabled" : ""}>
              Añadir
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}