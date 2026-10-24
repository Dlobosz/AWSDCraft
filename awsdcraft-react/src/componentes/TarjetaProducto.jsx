import { Link } from "react-router-dom";
import { formatearPrecio, precioConDescuento } from "../utilidades/formato";
import Boton from "./Boton";

export default function TarjetaProducto({ producto, onAgregar }) {
  const precioFinal = precioConDescuento(producto);
  const sinStock = producto.stock === 0;

  return (
    <div className="product-card">
      <Link to={`/producto/${producto.id}`}>
        <img src={`/img/${producto.imagen}`} alt={producto.nombre} />
      </Link>
      <div className="product-body d-flex flex-column">
        {producto.descuento > 0 && (
          <span className="badge bg-danger align-self-start mb-2">
            -{producto.descuento}%
          </span>
        )}
        <h3 className="h6 mb-1">{producto.nombre}</h3>
        <p className="small text-secondary mb-2">{producto.switch}</p>
        <p className="product-price mb-1">
          {formatearPrecio(precioFinal)}
          {producto.descuento > 0 && (
            <span className="text-secondary text-decoration-line-through ms-2 small">
              {formatearPrecio(producto.precio)}
            </span>
          )}
        </p>
        <p className="small text-secondary mb-3">
          {sinStock ? "Sin stock" : `Stock disponible: ${producto.stock}`}
        </p>
        <div className="mt-auto d-flex gap-2">
          <Link to={`/producto/${producto.id}`} className="btn btn-outline-awsd btn-sm">
            Ver detalle
          </Link>
          <Boton
            etiqueta="Añadir"
            className="btn-sm"
            deshabilitado={sinStock}
            onClick={() => onAgregar(producto)}
          />
        </div>
      </div>
    </div>
  );
}
