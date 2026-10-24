import { Link } from "react-router-dom";
import { blogs } from "../../datos/blogs";

export default function Blogs() {
  return (
    <section className="container py-5">
      <span className="section-kicker">Comunidad</span>
      <h1 className="awsd-title mb-4">Blog</h1>

      <div className="row g-4">
        {blogs.map((blog) => (
          <div className="col-12 col-md-6" key={blog.id}>
            <article className="product-card h-100">
              <img src={`/img/${blog.imagen}`} alt={blog.titulo} />
              <div className="product-body d-flex flex-column">
                <h2 className="h5 mb-2">{blog.titulo}</h2>
                <p className="text-secondary small mb-3">{blog.resumen}</p>
                <Link to={`/blogs/${blog.id}`} className="btn btn-outline-awsd btn-sm mt-auto align-self-start">
                  Leer artículo
                </Link>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
