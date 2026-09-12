document.addEventListener("DOMContentLoaded", () => {
  protegerVistaAdmin();

  const contenedor = document.getElementById("detalleProductoAdmin");
  const parametros = new URLSearchParams(window.location.search);
  const idProducto = Number(parametros.get("id"));
  const producto = obtenerProductosAdmin().find((p) => p.id === idProducto);

  if (!producto) {
    contenedor.innerHTML = `<p class="text-danger mb-0">No se encontró el producto.</p>`;
    return;
  }

  contenedor.innerHTML = `
    <div class="row g-4">
       <div class="col-md-4">
        <img src="../../img/${producto.imagen}" alt="${producto.nombre}" class="img-fluid rounded-3 border" style="border-color: var(--awsd-border) !important;">
      </div>
      <div class="col-md-8">
        <h2 class="h4 awsd-title mb-3">${producto.nombre}</h2>
        <p class="mb-1"><strong>Código:</strong> ${producto.codigo}</p>
        <p class="mb-1"><strong>Categoría:</strong> ${producto.categoria}</p>
        <p class="mb-1"><strong>Precio:</strong> ${formatearPrecio(producto.precio)}</p>
        <p class="mb-1"><strong>Stock:</strong> ${producto.stock} (crítico: ${producto.stockCritico})</p>
        <p class="mb-3"><strong>Descripción:</strong> ${producto.descripcion || "Sin descripción."}</p>
        <a href="producto-editar.html?id=${producto.id}" class="btn btn-awsd btn-sm">
          <i class="bi bi-pencil me-1"></i>Editar
        </a>
      </div>
    </div>
  `;
});