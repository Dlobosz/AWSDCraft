import { Link } from "react-router-dom";

export default function NoEncontrada() {
  return (
    <section className="container py-5 text-center">
      <span className="section-kicker">Error 404</span>
      <h1 className="awsd-title mb-3">Esta página no existe</h1>
      <p className="text-secondary mb-4">Puede que el enlace esté roto o que la página se haya movido.</p>
      <Link to="/" className="btn btn-awsd">
        Volver al home
      </Link>
    </section>
  );
}
