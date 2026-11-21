import { Link, useParams } from "react-router-dom";
import EstadoCarga from "../../componentes/EstadoCarga";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import ResumenOrden from "../../componentes/ResumenOrden";
import { useBoletaCompra } from "../../hooks/useBoletaCompra";

export default function PagoError() {
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
            <p className="text-end small text-secondary mb-2">Boleta {boleta.codigo}</p>
            <h1 className="awsd-title h3 text-danger mb-1">
              <i className="bi bi-x-circle me-2"></i>
              No se pudo realizar el pago nro #{boleta.id}
            </h1>
            <p className="text-secondary small mb-4">
              La transacción fue rechazada y no se descontó stock. Tu carrito sigue disponible para
              intentarlo con otro medio de pago.
            </p>

            <div className="text-center mb-4">
              <Link to="/checkout" className="btn btn-awsd">
                Volver a realizar el pago
              </Link>
            </div>

            <ResumenOrden orden={boleta} />
          </div>
        </div>
      </div>
    </section>
  );
}
