import { Link, useParams } from "react-router-dom";
import EstadoCarga from "../../componentes/EstadoCarga";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { useCarga } from "../../hooks/useCarga";
import { listarOrdenes } from "../../servicios/ordenesServicio";
import { obtenerUsuario } from "../../servicios/usuariosServicio";
import { claseEstado, etiquetaEstado } from "../../utilidades/estados";
import { formatearFecha, formatearFechaHora, formatearPrecio } from "../../utilidades/formato";
import { etiquetaRol } from "../../utilidades/permisos";

export default function UsuarioMostrar() {
  const { id } = useParams();
  // GET /usuarios/{id} y GET /boletas en paralelo; el historial se filtra por usuario o correo.
  const { datos, cargando, error } = useCarga(
    () => Promise.all([obtenerUsuario(id), listarOrdenes()]),
    [id]
  );

  if (cargando || error) {
    return (
      <>
        <EstadoCarga cargando={cargando} error={error} />
        {error && (
          <Link to="/admin/usuarios" className="btn btn-awsd">
            Volver al listado
          </Link>
        )}
      </>
    );
  }

  const [usuario, ordenes] = datos;
  const compras = ordenes.filter(
    (orden) => orden.usuarioId === usuario.id || orden.correo === usuario.correo.toLowerCase()
  );

  const filas = [
    ["RUN", usuario.run],
    ["Nombre", `${usuario.nombre} ${usuario.apellidos}`],
    ["Correo", usuario.correo],
    ["Rol", etiquetaRol(usuario.rol)],
    ["Fecha de nacimiento", formatearFecha(usuario.fechaNacimiento) || "-"],
    ["Región", usuario.region || "-"],
    ["Comuna", usuario.comuna || "-"],
    ["Dirección", usuario.direccion || "-"],
    ["Registrado el", formatearFechaHora(usuario.fechaRegistro)],
  ];

  return (
    <>
      <h1 className="awsd-title h3 mb-4">Detalle del usuario</h1>

      <div className="awsd-card border p-4 mb-4">
        <table className="table admin-table mb-4">
          <tbody>
            {filas.map(([etiqueta, valor]) => (
              <tr key={etiqueta}>
                <th className="w-25">{etiqueta}</th>
                <td>{valor}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="d-flex gap-2">
          <Link to={`/admin/usuarios/${usuario.id}/editar`} className="btn btn-awsd">
            Editar usuario
          </Link>
          <Link to="/admin/usuarios" className="btn btn-outline-secondary">
            Volver
          </Link>
        </div>
      </div>

      <h2 className="awsd-title h5 mb-3">Historial de compras</h2>

      {compras.length === 0 ? (
        <MensajeAlerta mensaje="Este usuario todavía no registra compras." tipo="info" />
      ) : (
        <div className="table-responsive awsd-card border p-3">
          <table className="table admin-table align-middle mb-0">
            <thead>
              <tr>
                <th>Boleta</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((orden) => (
                <tr key={orden.id}>
                  <td>{orden.codigo}</td>
                  <td>{formatearFechaHora(orden.fecha)}</td>
                  <td>{orden.items.length}</td>
                  <td>{formatearPrecio(orden.total)}</td>
                  <td>
                    <span className={`badge ${claseEstado(orden.estado)}`}>
                      {etiquetaEstado(orden.estado)}
                    </span>
                  </td>
                  <td>
                    <Link to={`/admin/ordenes/${orden.id}`} className="btn btn-sm btn-outline-awsd">
                      Ver
                    </Link>
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
