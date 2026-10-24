import { useState } from "react";
import ListaProductos from "../../componentes/ListaProductos";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { useCarrito } from "../../contexto/CarritoContexto";
import { listarOfertas } from "../../servicios/productosServicio";

export default function Ofertas() {
  const { agregar } = useCarrito();
  const [aviso, setAviso] = useState("");

  const ofertas = listarOfertas();

  function agregarProducto(producto) {
    agregar(producto, 1);
    setAviso(`"${producto.nombre}" se agregó al carrito.`);
  }

  return (
    <section className="container py-5">
      <span className="section-kicker">Precios rebajados</span>
      <h1 className="awsd-title mb-4">Ofertas de la semana</h1>

      <MensajeAlerta mensaje={aviso} tipo="success" />
      <ListaProductos
        productos={ofertas}
        onAgregar={agregarProducto}
        mensajeVacio="Por ahora no hay productos en oferta."
      />
    </section>
  );
}
