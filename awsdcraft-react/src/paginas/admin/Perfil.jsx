import { useSesion } from "../../contexto/SesionContexto";
import { listarOrdenes } from "../../servicios/ordenesServicio";

export default function Perfil() {
  const { usuario } = useSesion();
  const ordenes = listarOrdenes();

  const filas = [
    ["Nombre", `${usuario.nombre} ${usuario.apellidos}`],
    ["Correo", usuario.correo],
    ["Tipo de usuario", usuario.tipoUsuario],
    ["Región", usuario.region],
    ["Comuna", usuario.comuna],
    ["Dirección", usuario.direccion],
  ];

  return (
    <>
      <h1 className="awsd-title h3 mb-1">Perfil</h1>
      <p className="text-secondary small mb-4">Información de la cuenta con la que iniciaste sesión</p>

      <div className="awsd-card border p-4 mb-4">
        <table className="table admin-table mb-0">
          <tbody>
            {filas.map(([etiqueta, valor]) => (
              <tr key={etiqueta}>
                <th className="w-25">{etiqueta}</th>
                <td>{valor || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-stat-card">
        <p className="text-secondary small mb-1">Órdenes gestionadas en el sistema</p>
        <p className="stat-numero mb-0">{ordenes.length}</p>
      </div>
    </>
  );
}
