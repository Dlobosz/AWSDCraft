document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("blogsContainer");
  if (!contenedor) return;

  contenedor.innerHTML = blogs
    .map(
      (post) => `
      <article class="col-md-6">
        <div class="product-card h-100">
          <img src="../img/${post.imagen}" alt="${post.titulo}">
          <div class="product-body">
            <h2 class="h5 mb-2">${post.titulo}</h2>
            <p class="text-secondary small mb-3">${post.resumen}</p>
            <a href="blog-detalle-${post.id}.html" class="btn btn-outline-awsd btn-sm">Ver caso</a>
          </div>
        </div>
      </article>`
    )
    .join("");
});