import { Link, useParams } from "react-router-dom";
import EstadoCarga from "../../componentes/EstadoCarga";
import ResumenOrden from "../../componentes/ResumenOrden";
import { useCarga } from "../../hooks/useCarga";
import { obtenerOrden } from "../../servicios/ordenesServicio";
import { claseEstado, etiquetaEstado } from "../../utilidades/estados";
import { formatearFechaHora } from "../../utilidades/formato";

/**
 * Detalle de una compra propia. Si un cliente intenta abrir la boleta de otra persona,
 * el backend responde 403 y se muestra su mensaje.
 */
export default function MisCompraDetalle() {
  const { id } = useParams();
  const { datos: boleta, cargando, error } = useCarga(() => obtenerOrden(id), [id]);

  return (
    <section className="container py-5">
      <EstadoCarga cargando={cargando} error={error} texto="Cargando boleta..." />

      {boleta && (
        <div className="awsd-card border p-3 p-md-4">
          <h1 className="awsd-title h3 mb-1">Boleta {boleta.codigo}</h1>
          <p className="text-secondary small mb-4">
            Emitida el {formatearFechaHora(boleta.fecha)} ·{" "}
            <span className={`badge ${claseEstado(boleta.estado)}`}>
              {etiquetaEstado(boleta.estado)}
            </span>
          </p>
          <ResumenOrden orden={boleta} />
        </div>
      )}

      <Link to="/mis-compras" className="btn btn-outline-secondary mt-3">
        Volver a mis compras
      </Link>
    </section>
  );
}
