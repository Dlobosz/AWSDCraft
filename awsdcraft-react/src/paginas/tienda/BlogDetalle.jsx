import { Link, useParams } from "react-router-dom";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { blogs } from "../../datos/blogs";

export default function BlogDetalle() {
  const { id } = useParams();
  const blog = blogs.find((item) => item.id === Number(id));

  if (!blog) {
    return (
      <section className="container py-5">
        <MensajeAlerta mensaje="El artículo solicitado no existe." tipo="warning" />
        <Link to="/blogs" className="btn btn-awsd">
          Volver al blog
        </Link>
      </section>
    );
  }

  const parrafos = blog.contenido.split("\n\n");

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <Link to="/blogs" className="btn btn-outline-awsd btn-sm mb-4">
            Volver al blog
          </Link>

          <span className="section-kicker">Artículo</span>
          <h1 className="awsd-title mb-3">{blog.titulo}</h1>

          <img
            src={`/img/${blog.imagen}`}
            alt={blog.titulo}
            className="img-fluid rounded-4 border mb-4 w-100"
          />

          {parrafos.map((parrafo, indice) => (
            <p className="text-secondary" key={indice}>
              {parrafo.trim()}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
