document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("destacadosContainer");
  if (!contenedor) return;

  const destacados = productos.filter((p) => p.destacado).slice(0, 4);

  contenedor.innerHTML = destacados
    .map((producto) => crearTarjetaProducto(producto, "pages/"))
    .join("");
});