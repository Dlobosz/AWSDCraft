import { useState } from "react";
import { Link } from "react-router-dom";
import ListaProductos from "../../componentes/ListaProductos";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { useCarrito } from "../../contexto/CarritoContexto";
import { listarDestacados } from "../../servicios/productosServicio";

const beneficios = [
  { icono: "bi-truck", titulo: "Envíos a todo Chile", texto: "Despacho a domicilio en 3-5 días hábiles." },
  { icono: "bi-shield-check", titulo: "Garantía de fábrica", texto: "Switches y PCB con 12 meses de garantía." },
  { icono: "bi-sliders", titulo: "100% personalizable", texto: "Elige layout, switches y keycaps." },
];

export default function Home() {
  const { agregar } = useCarrito();
  const [aviso, setAviso] = useState("");
  const destacados = listarDestacados();

  function agregarProducto(producto) {
    agregar(producto, 1);
    setAviso(`"${producto.nombre}" se agregó al carrito.`);
  }

  return (
    <>
      <section className="hero py-5">
        <div className="container py-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <div className="hero-text-panel">
                <span className="section-kicker">Teclados a tu medida</span>
                <h1 className="awsd-title mb-3">Arma el teclado mecánico que siempre quisiste</h1>
                <p className="text-secondary mb-4">
                  Descubre nuestra amplia gama de teclados mecánicos personalizables y accesorios de
                  alta calidad. Diseña tu teclado ideal con nuestras opciones de switches, keycaps y
                  layouts.
                </p>
                <Link to="/productos" className="btn btn-awsd btn-lg px-4">
                  <i className="bi bi-bag me-2"></i>Ver productos
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <img src="/img/logo.jfif" alt="AWSDCraft.cl" className="img-fluid rounded-4 border" />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-4">
        <div className="row g-3">
          {beneficios.map((beneficio) => (
            <div className="col-12 col-md-4" key={beneficio.titulo}>
              <div className="info-box h-100">
                <i className={`bi ${beneficio.icono} fs-2 text-awsd-accent`}></i>
                <div>
                  <h3 className="h6 mb-1">{beneficio.titulo}</h3>
                  <p className="mb-0 small text-secondary">{beneficio.texto}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="section-kicker">Catálogo</span>
            <h2 className="awsd-title mb-0">Productos destacados</h2>
          </div>
          <Link to="/productos" className="btn btn-outline-awsd d-none d-md-inline-block">
            Ver todos
          </Link>
        </div>

        <MensajeAlerta mensaje={aviso} tipo="success" />
        <ListaProductos productos={destacados} onAgregar={agregarProducto} />
      </section>
    </>
  );
}
