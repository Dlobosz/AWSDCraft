document.addEventListener("DOMContentLoaded", () => {
  protegerVistaAdmin();

  const listaProductos = obtenerProductosAdmin();
  const listaUsuarios = obtenerUsuariosAdmin();
  const conStockCritico = listaProductos.filter((p) => p.stock <= p.stockCritico);

  document.getElementById("statTotalProductos").textContent = listaProductos.length;
  document.getElementById("statTotalUsuarios").textContent = listaUsuarios.length;
  document.getElementById("statStockCritico").textContent = conStockCritico.length;

  const contenedor = document.getElementById("listaStockCritico");
  contenedor.innerHTML = conStockCritico.length
    ? conStockCritico
        .map(
          (p) => `
        <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
          <span>${p.nombre}</span>
          <span class="badge-stock-critico">${p.stock} unidades</span>
        </div>`
        )
        .join("")
    : `<p class="text-secondary small mb-0">No hay productos con stock crítico por ahora.</p>`;
});