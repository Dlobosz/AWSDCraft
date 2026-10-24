import { Link } from "react-router-dom";
import { listarCategorias } from "../../servicios/categoriasServicio";
import { listarPorCategoria } from "../../servicios/productosServicio";

export default function Categorias() {
  const categorias = listarCategorias();

  return (
    <section className="container py-5">
      <span className="section-kicker">Explora</span>
      <h1 className="awsd-title mb-4">Categorías</h1>

      <div className="row g-4">
        {categorias.map((categoria) => (
          <div className="col-12 col-sm-6 col-lg-3" key={categoria.id}>
            <Link to={`/categorias/${categoria.slug}`} className="product-card d-block">
              <img src={`/img/${categoria.imagen}`} alt={categoria.nombre} />
              <div className="product-body">
                <h2 className="h6 mb-1">{categoria.nombre}</h2>
                <p className="small text-secondary mb-2">{categoria.descripcion}</p>
                <span className="small text-awsd-accent">
                  {listarPorCategoria(categoria.slug).length} productos
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
