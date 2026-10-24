import { useState } from "react";
import { Link } from "react-router-dom";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { listarOrdenes } from "../../servicios/ordenesServicio";
import { formatearFecha, formatearPrecio } from "../../utilidades/formato";

export default function OrdenesListado() {
  const [estado, setEstado] = useState("todas");
  const ordenes = listarOrdenes();

  const visibles = estado === "todas" ? ordenes : ordenes.filter((orden) => orden.estado === estado);

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
          <option value="Pagada">Pagadas</option>
          <option value="Rechazada">Rechazadas</option>
        </select>
      </div>

      {visibles.length === 0 ? (
        <MensajeAlerta mensaje="Todavía no hay órdenes registradas." tipo="info" />
      ) : (
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
              {visibles.map((orden) => (
                <tr key={orden.id}>
                  <td>{orden.codigo}</td>
                  <td>{formatearFecha(orden.fecha)}</td>
                  <td>
                    {orden.nombre} {orden.apellidos}
                  </td>
                  <td>{orden.correo}</td>
                  <td>{formatearPrecio(orden.total)}</td>
                  <td>
                    <span
                      className={`badge ${orden.estado === "Pagada" ? "bg-success" : "bg-danger"}`}
                    >
                      {orden.estado}
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
