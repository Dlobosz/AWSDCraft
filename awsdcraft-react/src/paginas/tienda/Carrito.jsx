import { Link, useNavigate } from "react-router-dom";
import Boton from "../../componentes/Boton";
import TablaCarrito from "../../componentes/TablaCarrito";
import { useCarrito } from "../../contexto/CarritoContexto";
import { formatearPrecio } from "../../utilidades/formato";

export default function Carrito() {
  const { items, total, cambiarCantidad, quitar, vaciar } = useCarrito();
  const navegar = useNavigate();

  if (items.length === 0) {
    return (
      <section className="container py-5">
        <h1 className="awsd-title mb-4">Carrito de compras</h1>
        <div className="cart-empty awsd-card border">
          <i className="bi bi-cart-x fs-1"></i>
          <p className="mt-3 mb-3">Tu carrito está vacío.</p>
          <Link to="/productos" className="btn btn-awsd">
            Ver productos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <h1 className="awsd-title mb-4">Carrito de compras</h1>

      <div className="awsd-card border p-3 p-md-4">
        <TablaCarrito items={items} onCambiarCantidad={cambiarCantidad} onQuitar={quitar} />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-4">
          <p className="h5 mb-0">Total: {formatearPrecio(total)}</p>
          <div className="d-flex gap-2">
            <Boton etiqueta="Limpiar carrito" variante="btn-outline-danger" onClick={vaciar} />
            <Boton
              etiqueta="Comprar ahora"
              icono="bi-credit-card"
              onClick={() => navegar("/checkout")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
