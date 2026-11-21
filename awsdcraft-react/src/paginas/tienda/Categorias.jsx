import { Link } from "react-router-dom";
import EstadoCarga from "../../componentes/EstadoCarga";
import { useCarga } from "../../hooks/useCarga";
import { listarCategorias } from "../../servicios/categoriasServicio";

export default function Categorias() {
  // GET /api/v1/categorias (cada categoría trae su cantidad de productos)
  const { datos: categorias, cargando, error } = useCarga(listarCategorias);

  return (
    <section className="container py-5">
      <span className="section-kicker">Explora</span>
      <h1 className="awsd-title mb-4">Categorías</h1>

      <EstadoCarga cargando={cargando} error={error} texto="Cargando categorías..." />
      <div className="row g-4">
        {(categorias ?? []).map((categoria) => (
          <div className="col-12 col-sm-6 col-lg-3" key={categoria.id}>
            <Link to={`/categorias/${categoria.slug}`} className="product-card d-block">
              <img src={`/img/${categoria.imagen}`} alt={categoria.nombre} />
              <div className="product-body">
                <h2 className="h6 mb-1">{categoria.nombre}</h2>
                <p className="small text-secondary mb-2">{categoria.descripcion}</p>
                <span className="small text-awsd-accent">
                  {categoria.cantidadProductos} productos
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
