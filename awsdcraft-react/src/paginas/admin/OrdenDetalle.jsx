import { Link, useParams } from "react-router-dom";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import ResumenOrden from "../../componentes/ResumenOrden";
import { obtenerOrden } from "../../servicios/ordenesServicio";
import { formatearFecha } from "../../utilidades/formato";

export default function OrdenDetalle() {
  const { id } = useParams();
  const orden = obtenerOrden(id);

  if (!orden) {
    return (
      <>
        <MensajeAlerta mensaje="La orden solicitada no existe." tipo="warning" />
        <Link to="/admin/ordenes" className="btn btn-awsd">
          Volver al listado
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="awsd-title h3 mb-1">Boleta {orden.codigo}</h1>
      <p className="text-secondary small mb-4">
        Emitida el {formatearFecha(orden.fecha)} · Estado: {orden.estado}
      </p>

      <div className="awsd-card border p-4">
        <ResumenOrden orden={orden} />

        <div className="d-flex gap-2 justify-content-center mt-4">
          <button className="btn btn-awsd" onClick={() => window.print()}>
            Imprimir boleta
          </button>
          <Link to="/admin/ordenes" className="btn btn-outline-secondary">
            Volver
          </Link>
        </div>
      </div>
    </>
  );
}
