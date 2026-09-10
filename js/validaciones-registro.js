document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formRegistro");
  if (!form) return;

  const selectRegion = document.getElementById("region");
  const selectComuna = document.getElementById("comuna");

  regiones.forEach((r) => {
    const opcion = document.createElement("option");
    opcion.value = r.nombre;
    opcion.textContent = r.nombre;
    selectRegion.appendChild(opcion);
  });
  selectRegion.addEventListener("change", () => {
    const regionElegida = regiones.find((r) => r.nombre === selectRegion.value);
    selectComuna.innerHTML = '<option value="" selected disabled>-- Seleccione la comuna --</option>';
    selectComuna.disabled = !regionElegida;

    if (regionElegida) {
      regionElegida.comunas.forEach((comuna) => {
        const opcion = document.createElement("option");
        opcion.value = comuna;
        opcion.textContent = comuna;
        selectComuna.appendChild(opcion);
      });
    }
  });

  const reglas = {
    run: (valor) => valor.trim() !== "" && validarRun(valor),
    nombre: (valor) => valor.trim() !== "" && valor.length <= 50,
    apellidos: (valor) => valor.trim() !== "" && valor.length <= 100,
    correo: (valor) => valor.trim() !== "" && valor.length <= 100 && correoPermitido(valor),
    direccion: (valor) => valor.trim() !== "" && valor.length <= 300,
    password: (valor) => valor.length >= 4 && valor.length <= 10,
    confirmarPassword: (valor) => valor === document.getElementById("password").value && valor !== "",
    region: (valor) => valor !== "",
    comuna: (valor) => valor !== "",
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

  document.getElementById("password").addEventListener("input", () => {
    const confirmar = document.getElementById("confirmarPassword");
    if (confirmar.value !== "") validarCampo(confirmar);
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    form.classList.add("was-validated-awsd");

    let formularioValido = true;
    Object.keys(reglas).forEach((id) => {
      const campo = document.getElementById(id);
      if (campo && !validarCampo(campo)) formularioValido = false;
    });

    const mensajeExito = document.getElementById("mensajeExitoRegistro");

    if (!formularioValido) {
      mensajeExito.classList.add("d-none");
      const primerError = form.querySelector(".is-invalid-awsd");
      if (primerError) primerError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    mensajeExito.classList.remove("d-none");
    form.reset();
    selectComuna.innerHTML = '<option value="" selected disabled>-- Seleccione la comuna --</option>';

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1800);
  });
});