document.addEventListener("DOMContentLoaded", () => {
  protegerVistaAdmin();

  const tabla = document.getElementById("tablaProductos");
  const listaProductos = obtenerProductosAdmin();

  tabla.innerHTML = listaProductos
    .map((p) => {
      const stockBajo = p.stock <= p.stockCritico;
      return `
        <tr>
          <td class="ps-3">${p.codigo}</td>
          <td>${p.nombre}</td>
          <td class="text-capitalize">${p.categoria}</td>
          <td>${formatearPrecio(p.precio)}</td>
          <td>
            ${p.stock}
            ${stockBajo ? '<span class="badge-stock-critico ms-1">crítico</span>' : ""}
          </td>
          <td class="text-end pe-3">
            <a href="producto-mostrar.html?id=${p.id}" class="btn btn-sm btn-outline-awsd">Ver</a>
            <a href="producto-editar.html?id=${p.id}" class="btn btn-sm btn-awsd">Editar</a>
          </td>
        </tr>`;
    })
    .join("");
});