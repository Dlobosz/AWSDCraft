document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formContacto");
  if (!form) return;

  const campoNombre = document.getElementById("nombreContacto");
  const campoCorreo = document.getElementById("correoContacto");
  const campoComentario = document.getElementById("comentarioContacto");

  function validarNombre() {
    const valido = campoNombre.value.trim() !== "" && campoNombre.value.length <= 100;
    campoNombre.classList.toggle("is-invalid-awsd", !valido);
    return valido;
  }

  function validarCorreo() {
    const valor = campoCorreo.value.trim();
    const valido = valor === "" || (valor.length <= 100 && correoPermitido(valor));
    campoCorreo.classList.toggle("is-invalid-awsd", !valido);
    return valido;
  }

  function validarComentario() {
    const valido = campoComentario.value.trim() !== "" && campoComentario.value.length <= 500;
    campoComentario.classList.toggle("is-invalid-awsd", !valido);
    return valido;
  }
  const contadorComentario = document.getElementById("contadorComentario");
  campoComentario.addEventListener("input", () => {
    contadorComentario.textContent = `${campoComentario.value.length} / 500`;
    if (campoComentario.classList.contains("is-invalid-awsd")) validarComentario();
  });

  campoNombre.addEventListener("blur", validarNombre);
  campoNombre.addEventListener("input", () => {
    if (campoNombre.classList.contains("is-invalid-awsd")) validarNombre();
  });

  campoCorreo.addEventListener("blur", validarCorreo);
  campoCorreo.addEventListener("input", () => {
    if (campoCorreo.classList.contains("is-invalid-awsd")) validarCorreo();
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombreValido = validarNombre();
    const correoValido = validarCorreo();
    const comentarioValido = validarComentario();

    const mensajeExito = document.getElementById("mensajeExitoContacto");

    if (!nombreValido || !correoValido || !comentarioValido) {
      mensajeExito.classList.add("d-none");
      return;
    }

    mensajeExito.classList.remove("d-none");
    form.reset();
    contadorComentario.textContent = "0 / 500";
  });
});