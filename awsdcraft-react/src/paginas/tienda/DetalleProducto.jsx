import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Boton from "../../componentes/Boton";
import ControlCantidad from "../../componentes/ControlCantidad";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { useCarrito } from "../../contexto/CarritoContexto";
import { obtenerProducto } from "../../servicios/productosServicio";
import { formatearPrecio, precioConDescuento } from "../../utilidades/formato";

export default function DetalleProducto() {
  const { id } = useParams();
  const { agregar } = useCarrito();
  const [cantidad, setCantidad] = useState(1);
  const [aviso, setAviso] = useState("");

  const producto = obtenerProducto(id);

  if (!producto) {
    return (
      <section className="container py-5">
        <h1 className="awsd-title">Producto no encontrado</h1>
        <Link to="/productos" className="btn btn-awsd mt-3">
          Volver al catálogo
        </Link>
      </section>
    );
  }

  const precioFinal = precioConDescuento(producto);

  return (
    <section className="container py-5">
      <nav aria-label="Ruta de navegación" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/productos">Productos</Link>
          </li>
          <li className="breadcrumb-item active">{producto.nombre}</li>
        </ol>
      </nav>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <img
            src={`/img/${producto.imagen}`}
            alt={producto.nombre}
            className="img-fluid rounded-4 border w-100"
          />
        </div>

        <div className="col-12 col-lg-6">
          <span className="section-kicker">{producto.categoria}</span>
          <h1 className="awsd-title mb-2">{producto.nombre}</h1>
          <p className="text-secondary">Código {producto.codigo}</p>

          <p className="h3 product-price mb-1">
            {formatearPrecio(precioFinal)}
            {producto.descuento > 0 && (
              <span className="text-secondary text-decoration-line-through ms-2 h6">
                {formatearPrecio(producto.precio)}
              </span>
            )}
          </p>

          <p className="text-secondary mb-4">{producto.descripcion}</p>

          <ul className="list-unstyled small text-secondary mb-4">
            <li>
              <strong>Switch:</strong> {producto.switch}
            </li>
            <li>
              <strong>Stock:</strong> {producto.stock} unidades
            </li>
          </ul>

          <MensajeAlerta mensaje={aviso} tipo="success" />

          {producto.stock === 0 ? (
            <MensajeAlerta mensaje="Producto sin stock disponible." tipo="warning" />
          ) : (
            <div className="d-flex align-items-center gap-3">
              <ControlCantidad cantidad={cantidad} maximo={producto.stock} onCambiar={setCantidad} />
              <Boton
                etiqueta="Añadir al carrito"
                icono="bi-cart-plus"
                onClick={() => {
                  agregar(producto, cantidad);
                  setAviso(`Se agregaron ${cantidad} unidades al carrito.`);
                }}
              />
            </div>
          )}

          <Link to="/carrito" className="btn btn-outline-awsd mt-3">
            Ir al carrito
          </Link>
        </div>
      </div>
    </section>
  );
}
