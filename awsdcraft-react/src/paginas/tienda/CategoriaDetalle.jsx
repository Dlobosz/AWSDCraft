import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import EstadoCarga from "../../componentes/EstadoCarga";
import ListaProductos from "../../componentes/ListaProductos";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { useCarrito } from "../../contexto/CarritoContexto";
import { useCarga } from "../../hooks/useCarga";
import { listarCategorias } from "../../servicios/categoriasServicio";
import { listarPorCategoria } from "../../servicios/productosServicio";

export default function CategoriaDetalle() {
  const { slug } = useParams();
  const { agregar } = useCarrito();
  const [aviso, setAviso] = useState("");

  // GET /api/v1/categorias y GET /api/v1/productos?categoria={slug} en paralelo
  const { datos, cargando, error } = useCarga(
    () => Promise.all([listarCategorias(), listarPorCategoria(slug)]),
    [slug]
  );
  const [categorias, productos] = datos ?? [[], []];
  const categoria = categorias.find((item) => item.slug === slug);

  function agregarProducto(producto) {
    agregar(producto, 1);
    setAviso(`"${producto.nombre}" se agregó al carrito.`);
  }

  return (
    <section className="container py-5">
      <div className="d-flex flex-wrap gap-2 mb-4">
        {categorias.map((item) => (
          <Link
            key={item.id}
            to={`/categorias/${item.slug}`}
            className={`category-pill ${item.slug === slug ? "active" : ""}`}
          >
            {item.nombre}
          </Link>
        ))}
      </div>

      <EstadoCarga cargando={cargando} error={error} />
      {!datos ? null : categoria ? (
        <>
          <span className="section-kicker">Categoría</span>
          <h1 className="awsd-title mb-2">{categoria.nombre}</h1>
          <p className="text-secondary mb-4">{categoria.descripcion}</p>

          <MensajeAlerta mensaje={aviso} tipo="success" />
          <ListaProductos
            productos={productos}
            onAgregar={agregarProducto}
            mensajeVacio="Esta categoría todavía no tiene productos."
          />
        </>
      ) : (
        <MensajeAlerta mensaje="La categoría solicitada no existe." tipo="warning" />
      )}
    </section>
  );
}
