import { useState } from "react";
import { Link } from "react-router-dom";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { eliminarUsuario, listarUsuarios } from "../../servicios/usuariosServicio";

export default function UsuariosListado() {
  const [usuarios, setUsuarios] = useState(listarUsuarios);
  const [aviso, setAviso] = useState("");

  function borrar(usuario) {
    if (!window.confirm(`¿Eliminar a ${usuario.nombre} ${usuario.apellidos}?`)) return;
    setUsuarios(eliminarUsuario(usuario.id));
    setAviso(`El usuario ${usuario.correo} fue eliminado.`);
  }

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h1 className="awsd-title h3 mb-1">Usuarios</h1>
          <p className="text-secondary small mb-0">{usuarios.length} cuentas registradas</p>
        </div>
        <Link to="/admin/usuarios/nuevo" className="btn btn-awsd">
          <i className="bi bi-plus-lg me-2"></i>Nuevo usuario
        </Link>
      </div>

      <MensajeAlerta mensaje={aviso} tipo="success" />

      <div className="table-responsive awsd-card border p-3">
        <table className="table admin-table align-middle mb-0">
          <thead>
            <tr>
              <th>RUN</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Tipo</th>
              <th>Región</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.run}</td>
                <td>
                  {usuario.nombre} {usuario.apellidos}
                </td>
                <td>{usuario.correo}</td>
                <td>{usuario.tipoUsuario}</td>
                <td>{usuario.region}</td>
                <td className="d-flex gap-2">
                  <Link to={`/admin/usuarios/${usuario.id}`} className="btn btn-sm btn-outline-awsd">
                    Ver
                  </Link>
                  <Link
                    to={`/admin/usuarios/${usuario.id}/editar`}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => borrar(usuario)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
