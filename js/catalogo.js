document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("catalogoContainer");
  const sinResultados = document.getElementById("sinResultados");
  const botonesFiltro = document.querySelectorAll(".category-pill");

  if (!contenedor) return;

  function pintarProductos(categoria) {
    const listaFiltrada =
      categoria === "todos"
        ? productos
        : productos.filter((p) => p.categoria === categoria);

    if (listaFiltrada.length === 0) {
      contenedor.innerHTML = "";
      sinResultados.classList.remove("d-none");
      return;
    }

    sinResultados.classList.add("d-none");
    contenedor.innerHTML = listaFiltrada
      .map((producto) => crearTarjetaProducto(producto, ""))
      .join("");
  }

  botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", () => {
      botonesFiltro.forEach((b) => b.classList.remove("active"));
      boton.classList.add("active");
      pintarProductos(boton.dataset.categoria);
    });
  });

  pintarProductos("todos");
});