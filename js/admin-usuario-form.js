document.addEventListener("DOMContentLoaded", () => {
  protegerVistaAdmin();

  const form = document.getElementById("formUsuario");
  if (!form) return;

  const selectTipoUsuario = document.getElementById("tipoUsuario");
  const selectRegion = document.getElementById("region");
  const selectComuna = document.getElementById("comuna");

  TIPOS_USUARIO.forEach((tipo) => {
    const opcion = document.createElement("option");
    opcion.value = tipo;
    opcion.textContent = tipo;
    selectTipoUsuario.appendChild(opcion);
  });

  regiones.forEach((r) => {
    const opcion = document.createElement("option");
    opcion.value = r.nombre;
    opcion.textContent = r.nombre;
    selectRegion.appendChild(opcion);
  });

  function poblarComunas(nombreRegion, comunaSeleccionada) {
    const regionElegida = regiones.find((r) => r.nombre === nombreRegion);
    selectComuna.innerHTML = '<option value="" selected disabled>-- Seleccione la comuna --</option>';
    selectComuna.disabled = !regionElegida;

    if (regionElegida) {
      regionElegida.comunas.forEach((comuna) => {
        const opcion = document.createElement("option");
        opcion.value = comuna;
        opcion.textContent = comuna;
        if (comuna === comunaSeleccionada) opcion.selected = true;
        selectComuna.appendChild(opcion);
      });
    }
  }

  selectRegion.addEventListener("change", () => poblarComunas(selectRegion.value, null));
  const parametros = new URLSearchParams(window.location.search);
  const idUsuario = Number(parametros.get("id"));
  const esEdicion = !!idUsuario;
  const usuarioExistente = esEdicion
    ? obtenerUsuariosAdmin().find((u) => u.id === idUsuario)
    : null;

  document.getElementById("tituloForm").textContent = esEdicion ? "Editar usuario" : "Nuevo usuario";

  if (esEdicion && usuarioExistente) {
    document.getElementById("run").value = usuarioExistente.run;
    document.getElementById("nombre").value = usuarioExistente.nombre;
    document.getElementById("apellidos").value = usuarioExistente.apellidos;
    document.getElementById("correo").value = usuarioExistente.correo;
    document.getElementById("fechaNacimiento").value = usuarioExistente.fechaNacimiento || "";
    document.getElementById("tipoUsuario").value = usuarioExistente.tipoUsuario;
    document.getElementById("region").value = usuarioExistente.region;
    poblarComunas(usuarioExistente.region, usuarioExistente.comuna);
    document.getElementById("direccion").value = usuarioExistente.direccion;
  } else if (esEdicion && !usuarioExistente) {
    form.innerHTML = `<p class="text-danger">No se encontró el usuario solicitado.</p>`;
    return;
  }
  const reglas = {
    run: (v) => v.trim() !== "" && validarRun(v),
    nombre: (v) => v.trim() !== "" && v.length <= 50,
    apellidos: (v) => v.trim() !== "" && v.length <= 100,
    correo: (v) => v.trim() !== "" && v.length <= 100 && correoPermitido(v),
    tipoUsuario: (v) => v !== "",
    region: (v) => v !== "",
    comuna: (v) => v !== "",
    direccion: (v) => v.trim() !== "" && v.length <= 300,
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

    const datosUsuario = {
      id: esEdicion ? idUsuario : obtenerProximoIdUsuario(),
      run: document.getElementById("run").value.trim(),
      nombre: document.getElementById("nombre").value.trim(),
      apellidos: document.getElementById("apellidos").value.trim(),
      correo: document.getElementById("correo").value.trim(),
      fechaNacimiento: document.getElementById("fechaNacimiento").value,
      tipoUsuario: document.getElementById("tipoUsuario").value,
      region: document.getElementById("region").value,
      comuna: document.getElementById("comuna").value,
      direccion: document.getElementById("direccion").value.trim(),
    };

    const lista = obtenerUsuariosAdmin();

    if (esEdicion) {
      const indice = lista.findIndex((u) => u.id === idUsuario);
      lista[indice] = datosUsuario;
    } else {
      lista.push(datosUsuario);
    }

    guardarUsuariosAdmin(lista);
    window.location.href = "usuarios-listado.html";
  });
});