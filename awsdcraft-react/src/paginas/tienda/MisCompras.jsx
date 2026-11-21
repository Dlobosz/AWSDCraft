import { Link } from "react-router-dom";
import EstadoCarga from "../../componentes/EstadoCarga";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { useCarga } from "../../hooks/useCarga";
import { listarMisOrdenes } from "../../servicios/ordenesServicio";
import { claseEstado, etiquetaEstado } from "../../utilidades/estados";
import { formatearFechaHora, formatearPrecio } from "../../utilidades/formato";

/** Historial de compras del usuario con sesión iniciada (GET /api/v1/boletas/mis-boletas). */
export default function MisCompras() {
  const { datos: boletas, cargando, error } = useCarga(listarMisOrdenes);

  return (
    <section className="container py-5">
      <span className="section-kicker">Mi cuenta</span>
      <h1 className="awsd-title mb-4">Mis compras</h1>

      <EstadoCarga cargando={cargando} error={error} texto="Cargando tus compras..." />

      {boletas && boletas.length === 0 && (
        <MensajeAlerta
          mensaje="Todavía no tienes compras asociadas a tu cuenta."
          tipo="info"
        />
      )}

      {boletas && boletas.length > 0 && (
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
              {boletas.map((boleta) => (
                <tr key={boleta.id}>
                  <td>{boleta.codigo}</td>
                  <td>{formatearFechaHora(boleta.fecha)}</td>
                  <td>{boleta.items.length}</td>
                  <td>{formatearPrecio(boleta.total)}</td>
                  <td>
                    <span className={`badge ${claseEstado(boleta.estado)}`}>
                      {etiquetaEstado(boleta.estado)}
                    </span>
                  </td>
                  <td>
                    <Link to={`/mis-compras/${boleta.id}`} className="btn btn-sm btn-outline-awsd">
                      Ver boleta
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
