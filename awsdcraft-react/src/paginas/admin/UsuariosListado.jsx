import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import EstadoCarga from "../../componentes/EstadoCarga";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { useSesion } from "../../contexto/SesionContexto";
import { useCarga } from "../../hooks/useCarga";
import { mensajeError } from "../../servicios/api";
import { eliminarUsuario, listarUsuarios } from "../../servicios/usuariosServicio";
import { etiquetaRol } from "../../utilidades/permisos";

export default function UsuariosListado() {
  const ubicacion = useLocation();
  const { usuario: sesion } = useSesion();
  const { datos: usuarios, cargando, error, setDatos } = useCarga(listarUsuarios);
  const [aviso, setAviso] = useState(ubicacion.state?.aviso ?? "");
  const [errorAccion, setErrorAccion] = useState("");

  async function borrar(usuario) {
    if (!window.confirm(`¿Eliminar a ${usuario.nombre} ${usuario.apellidos}?`)) return;
    setErrorAccion("");
    try {
      await eliminarUsuario(usuario.id); // DELETE /api/v1/usuarios/{id}
      setDatos((actuales) => actuales.filter((item) => item.id !== usuario.id));
      setAviso(`El usuario ${usuario.correo} fue eliminado.`);
    } catch (e) {
      setAviso("");
      setErrorAccion(mensajeError(e)); // p. ej. "No puedes eliminar al último administrador"
    }
  }

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h1 className="awsd-title h3 mb-1">Usuarios</h1>
          <p className="text-secondary small mb-0">{usuarios?.length ?? 0} cuentas registradas</p>
        </div>
        <Link to="/admin/usuarios/nuevo" className="btn btn-awsd">
          <i className="bi bi-plus-lg me-2"></i>Nuevo usuario
        </Link>
      </div>

      <MensajeAlerta mensaje={aviso} tipo="success" />
      <MensajeAlerta mensaje={errorAccion} />
      <EstadoCarga cargando={cargando} error={error} texto="Cargando usuarios..." />

      {usuarios && (
        <div className="table-responsive awsd-card border p-3">
          <table className="table admin-table align-middle mb-0">
            <thead>
              <tr>
                <th>RUN</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
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
                  <td>{etiquetaRol(usuario.rol)}</td>
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
                      disabled={usuario.id === sesion?.id}
                      title={usuario.id === sesion?.id ? "No puedes eliminar tu propia cuenta" : ""}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
