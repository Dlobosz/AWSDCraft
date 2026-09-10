document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formLogin");
  if (!form) return;

  const campoCorreo = document.getElementById("correoLogin");
  const campoPassword = document.getElementById("passwordLogin");

  function validarCorreo() {
    const valido = campoCorreo.value.trim() !== ""
      && campoCorreo.value.length <= 100
      && correoPermitido(campoCorreo.value);
    campoCorreo.classList.toggle("is-invalid-awsd", !valido);
    return valido;
  }

  function validarPassword() {
    const valido = campoPassword.value.length >= 4 && campoPassword.value.length <= 10;
    campoPassword.classList.toggle("is-invalid-awsd", !valido);
    return valido;
  }

  campoCorreo.addEventListener("blur", validarCorreo);
  campoPassword.addEventListener("blur", validarPassword);
  campoCorreo.addEventListener("input", () => {
    if (campoCorreo.classList.contains("is-invalid-awsd")) validarCorreo();
  });
  campoPassword.addEventListener("input", () => {
    if (campoPassword.classList.contains("is-invalid-awsd")) validarPassword();
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const correoValido = validarCorreo();
    const passwordValido = validarPassword();
    const mensajeError = document.getElementById("mensajeErrorLogin");

    if (!correoValido || !passwordValido) {
      mensajeError.textContent = "Revisa los datos ingresados: correo o contraseña no cumplen el formato requerido.";
      mensajeError.classList.remove("d-none");
      return;
    }

    mensajeError.classList.add("d-none");
    localStorage.setItem("awsdcraft_sesion", JSON.stringify({ correo: campoCorreo.value.trim() }));

    const mensajeExito = document.getElementById("mensajeExitoLogin");
    mensajeExito.classList.remove("d-none");

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1200);
  });
});