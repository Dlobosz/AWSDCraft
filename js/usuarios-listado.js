document.addEventListener("DOMContentLoaded", () => {
  protegerVistaAdmin();

  const tabla = document.getElementById("tablaUsuarios");
  const listaUsuarios = obtenerUsuariosAdmin();

  tabla.innerHTML = listaUsuarios
    .map(
      (u) => `
        <tr>
          <td class="ps-3">${u.run}</td>
          <td>${u.nombre} ${u.apellidos}</td>
          <td>${u.correo}</td>
          <td>${u.tipoUsuario}</td>
          <td>${u.comuna}</td>
          <td class="text-end pe-3">
            <a href="usuario-mostrar.html?id=${u.id}" class="btn btn-sm btn-outline-awsd">Ver</a>
            <a href="usuario-editar.html?id=${u.id}" class="btn btn-sm btn-awsd">Editar</a>
          </td>
        </tr>`
    )
    .join("");
});