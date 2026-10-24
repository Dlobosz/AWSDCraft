import { Link, useParams } from "react-router-dom";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { listarOrdenesDeCorreo } from "../../servicios/ordenesServicio";
import { obtenerUsuario } from "../../servicios/usuariosServicio";
import { formatearFecha, formatearPrecio } from "../../utilidades/formato";

export default function UsuarioMostrar() {
  const { id } = useParams();
  const usuario = obtenerUsuario(id);

  if (!usuario) {
    return (
      <>
        <MensajeAlerta mensaje="El usuario solicitado no existe." tipo="warning" />
        <Link to="/admin/usuarios" className="btn btn-awsd">
          Volver al listado
        </Link>
      </>
    );
  }

  const compras = listarOrdenesDeCorreo(usuario.correo);

  const filas = [
    ["RUN", usuario.run],
    ["Nombre", `${usuario.nombre} ${usuario.apellidos}`],
    ["Correo", usuario.correo],
    ["Tipo de usuario", usuario.tipoUsuario],
    ["Región", usuario.region],
    ["Comuna", usuario.comuna],
    ["Dirección", usuario.direccion],
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
                <th>Orden</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Boleta</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((orden) => (
                <tr key={orden.id}>
                  <td>{orden.codigo}</td>
                  <td>{formatearFecha(orden.fecha)}</td>
                  <td>{orden.items.length}</td>
                  <td>{formatearPrecio(orden.total)}</td>
                  <td>{orden.estado}</td>
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
