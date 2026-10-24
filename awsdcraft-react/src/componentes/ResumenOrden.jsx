import TablaCarrito from "./TablaCarrito";
import { formatearPrecio } from "../utilidades/formato";

export default function ResumenOrden({ orden }) {
  return (
    <>
      <dl className="row small mb-4">
        <dt className="col-5 col-md-3">Cliente</dt>
        <dd className="col-7 col-md-9">
          {orden.nombre} {orden.apellidos}
        </dd>

        <dt className="col-5 col-md-3">Correo</dt>
        <dd className="col-7 col-md-9">{orden.correo}</dd>

        <dt className="col-5 col-md-3">Dirección</dt>
        <dd className="col-7 col-md-9">
          {orden.calle}
          {orden.departamento && `, ${orden.departamento}`}, {orden.comuna}, {orden.region}
        </dd>

        {orden.indicaciones && (
          <>
            <dt className="col-5 col-md-3">Indicaciones</dt>
            <dd className="col-7 col-md-9">{orden.indicaciones}</dd>
          </>
        )}
      </dl>

      <TablaCarrito items={orden.items} editable={false} />

      <p className="h5 text-center mt-4 mb-0">Total: {formatearPrecio(orden.total)}</p>
    </>
  );
}
