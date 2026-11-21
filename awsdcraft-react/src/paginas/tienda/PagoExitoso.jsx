import { Link, useParams } from "react-router-dom";
import EstadoCarga from "../../componentes/EstadoCarga";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import ResumenOrden from "../../componentes/ResumenOrden";
import { useBoletaCompra } from "../../hooks/useBoletaCompra";
import { formatearFechaHora } from "../../utilidades/formato";

export default function PagoExitoso() {
  const { id } = useParams();
  const { boleta, cargando, error } = useBoletaCompra(id);

  if (cargando || error) {
    return (
      <section className="container py-5">
        <EstadoCarga cargando={cargando} error={error} texto="Cargando boleta..." />
      </section>
    );
  }

  if (!boleta) {
    return (
      <section className="container py-5">
        <MensajeAlerta mensaje="No encontramos la orden solicitada." tipo="warning" />
        <Link to="/productos" className="btn btn-awsd">
          Volver al catálogo
        </Link>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9">
          <div className="awsd-card border p-3 p-md-4">
            <p className="text-end small text-secondary mb-2">
              Boleta {boleta.codigo} · {formatearFechaHora(boleta.fecha)}
            </p>
            <h1 className="awsd-title h3 text-success mb-1">
              <i className="bi bi-check-circle me-2"></i>
              Se ha realizado la compra nro #{boleta.id}
            </h1>
            <p className="text-secondary small mb-4">
              Te enviamos el detalle de la compra a tu correo.
            </p>

            <ResumenOrden orden={boleta} />

            <div className="d-flex justify-content-center gap-2 mt-4">
              <Link to="/productos" className="btn btn-outline-awsd">
                Seguir comprando
              </Link>
              <button className="btn btn-awsd" onClick={() => window.print()}>
                Imprimir boleta
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
