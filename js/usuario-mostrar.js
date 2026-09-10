document.addEventListener("DOMContentLoaded", () => {
  protegerVistaAdmin();

  const contenedor = document.getElementById("detalleUsuarioAdmin");
  const parametros = new URLSearchParams(window.location.search);
  const idUsuario = Number(parametros.get("id"));
  const usuario = obtenerUsuariosAdmin().find((u) => u.id === idUsuario);

  if (!usuario) {
    contenedor.innerHTML = `<p class="text-danger mb-0">No se encontró el usuario.</p>`;
    return;
  }

  contenedor.innerHTML = `
    <h2 class="h4 awsd-title mb-3">${usuario.nombre} ${usuario.apellidos}</h2>
    <p class="mb-1"><strong>RUN:</strong> ${usuario.run}</p>
    <p class="mb-1"><strong>Correo:</strong> ${usuario.correo}</p>
    <p class="mb-1"><strong>Tipo de usuario:</strong> ${usuario.tipoUsuario}</p>
    <p class="mb-1"><strong>Fecha de nacimiento:</strong> ${usuario.fechaNacimiento || "No especificada"}</p>
    <p class="mb-1"><strong>Región:</strong> ${usuario.region}</p>
    <p class="mb-1"><strong>Comuna:</strong> ${usuario.comuna}</p>
    <p class="mb-3"><strong>Dirección:</strong> ${usuario.direccion}</p>
    <a href="usuario-editar.html?id=${usuario.id}" class="btn btn-awsd btn-sm">
      <i class="bi bi-pencil me-1"></i>Editar
    </a>
  `;
});