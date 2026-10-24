import { Link } from "react-router-dom";

export default function PiePagina() {
  return (
    <footer className="awsd-footer py-4 mt-5">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <span>&copy; 2026 AWSDCraft.cl. Todos los derechos reservados.</span>
        <div className="d-flex gap-3">
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/contacto">Contacto</Link>
          <Link to="/blogs">Blogs</Link>
        </div>
      </div>
    </footer>
  );
}
