
document.addEventListener("DOMContentLoaded", () => {
  protegerVistaAdmin();

  const form = document.getElementById("formProducto");
  if (!form) return;

  const selectCategoria = document.getElementById("categoria");
  CATEGORIAS_PRODUCTO.forEach((cat) => {
    const opcion = document.createElement("option");
    opcion.value = cat;
    opcion.textContent = cat;
    selectCategoria.appendChild(opcion);
  });

  const parametros = new URLSearchParams(window.location.search);
  const idProducto = Number(parametros.get("id"));
  const esEdicion = !!idProducto;
  const productoExistente = esEdicion
    ? obtenerProductosAdmin().find((p) => p.id === idProducto)
    : null;

  document.getElementById("tituloForm").textContent = esEdicion ? "Editar producto" : "Nuevo producto";
  if (esEdicion && productoExistente) {
    document.getElementById("codigo").value = productoExistente.codigo;
    document.getElementById("nombre").value = productoExistente.nombre;
    document.getElementById("descripcion").value = productoExistente.descripcion || "";
    document.getElementById("precio").value = productoExistente.precio;
    document.getElementById("stock").value = productoExistente.stock;
    document.getElementById("stockCritico").value = productoExistente.stockCritico || "";
    document.getElementById("categoria").value = productoExistente.categoria;
    document.getElementById("imagen").value = productoExistente.imagen || "";
  } else if (esEdicion && !productoExistente) {
    form.innerHTML = `<p class="text-danger">No se encontró el producto solicitado.</p>`;
    return;
  }

  const reglas = {
    codigo: (v) => v.trim().length >= 3,
    nombre: (v) => v.trim() !== "" && v.length <= 100,
    descripcion: (v) => v.length <= 500, 
    precio: (v) => v !== "" && Number(v) >= 0,
    stock: (v) => v !== "" && Number.isInteger(Number(v)) && Number(v) >= 0,
    stockCritico: (v) => v === "" || (Number.isInteger(Number(v)) && Number(v) >= 0), 
    categoria: (v) => v !== "",
  };

  function validarCampo(campo) {
    const regla = reglas[campo.id];
    if (!regla) return true;
    const esValido = regla(campo.value);
    campo.classList.toggle("is-invalid-awsd", !esValido);
    return esValido;
  }

  Object.keys(reglas).forEach((id) => {
    const campo = document.getElementById(id);
    if (!campo) return;
    campo.addEventListener("blur", () => validarCampo(campo));
    campo.addEventListener("input", () => {
      if (campo.classList.contains("is-invalid-awsd")) validarCampo(campo);
    });
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    let formularioValido = true;
    Object.keys(reglas).forEach((id) => {
      const campo = document.getElementById(id);
      if (campo && !validarCampo(campo)) formularioValido = false;
    });
    if (!formularioValido) return;

    const datosProducto = {
      id: esEdicion ? idProducto : obtenerProximoIdProducto(),
      codigo: document.getElementById("codigo").value.trim(),
      nombre: document.getElementById("nombre").value.trim(),
      categoria: document.getElementById("categoria").value,
      precio: Number(document.getElementById("precio").value),
      stock: Number(document.getElementById("stock").value),
      stockCritico: document.getElementById("stockCritico").value === ""
        ? 0
        : Number(document.getElementById("stockCritico").value),
      switch: productoExistente?.switch || "N/A",
      descripcion: document.getElementById("descripcion").value.trim(),
      imagen: document.getElementById("imagen").value.trim()
        || "https://placehold.co/500x400/4cc9f0/ffffff?text=" + encodeURIComponent(document.getElementById("nombre").value),
      destacado: productoExistente?.destacado || false,
    };

    const lista = obtenerProductosAdmin();

    if (esEdicion) {
      const indice = lista.findIndex((p) => p.id === idProducto);
      lista[indice] = datosProducto;
    } else {
      lista.push(datosProducto);
    }

    guardarProductosAdmin(lista);
    window.location.href = "productos-listado.html";
  });
});