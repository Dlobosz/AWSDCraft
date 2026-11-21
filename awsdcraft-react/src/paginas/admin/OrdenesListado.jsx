import { useState } from "react";
import { Link } from "react-router-dom";
import EstadoCarga from "../../componentes/EstadoCarga";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { useCarga } from "../../hooks/useCarga";
import { listarOrdenes } from "../../servicios/ordenesServicio";
import { ESTADOS_BOLETA, claseEstado, etiquetaEstado } from "../../utilidades/estados";
import { formatearFechaHora, formatearPrecio } from "../../utilidades/formato";

/** Visible para ADMIN y VENDEDOR. */
export default function OrdenesListado() {
  const [estado, setEstado] = useState("todas");

  // GET /api/v1/boletas?estado=... (el filtro lo resuelve el backend)
  const { datos: ordenes, cargando, error } = useCarga(
    () => listarOrdenes(estado === "todas" ? undefined : estado),
    [estado]
  );

  return (
    <>
      <h1 className="awsd-title h3 mb-1">Órdenes y boletas</h1>
      <p className="text-secondary small mb-4">Seguimiento de todas las compras realizadas</p>

      <div className="col-12 col-md-4 mb-3">
        <select
          className="form-select"
          value={estado}
          onChange={(evento) => setEstado(evento.target.value)}
          aria-label="Filtrar por estado"
        >
          <option value="todas">Todos los estados</option>
          {ESTADOS_BOLETA.map((opcion) => (
            <option key={opcion} value={opcion}>
              {etiquetaEstado(opcion)}
            </option>
          ))}
        </select>
      </div>

      <EstadoCarga cargando={cargando} error={error} texto="Cargando órdenes..." />

      {ordenes && ordenes.length === 0 && (
        <MensajeAlerta mensaje="No hay órdenes para el filtro seleccionado." tipo="info" />
      )}

      {ordenes && ordenes.length > 0 && (
        <div className="table-responsive awsd-card border p-3">
          <table className="table admin-table align-middle mb-0">
            <thead>
              <tr>
                <th>Código</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Correo</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Boleta</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.id}>
                  <td>{orden.codigo}</td>
                  <td>{formatearFechaHora(orden.fecha)}</td>
                  <td>
                    {orden.nombre} {orden.apellidos}
                  </td>
                  <td>{orden.correo}</td>
                  <td>{formatearPrecio(orden.total)}</td>
                  <td>
                    <span className={`badge ${claseEstado(orden.estado)}`}>
                      {etiquetaEstado(orden.estado)}
                    </span>
                  </td>
                  <td>
                    <Link to={`/admin/ordenes/${orden.id}`} className="btn btn-sm btn-outline-awsd">
                      Mostrar boleta
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
