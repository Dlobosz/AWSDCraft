import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCarrito } from "../contexto/CarritoContexto";
import { useSesion } from "../contexto/SesionContexto";

export default function Encabezado() {
  const { cantidadTotal } = useCarrito();
  const { usuario, esAdministrador, cerrarSesion } = useSesion();
  const navegar = useNavigate();

  function salir() {
    cerrarSesion();
    navegar("/");
  }

  return (
    <header>
      <div className="top-bar text-center py-2">
        <span>
          <i className="bi bi-truck me-1"></i> Envíos a todo Chile
        </span>
        <span className="mx-2">|</span>
        <span className="text-awsd-accent">Arma tu teclado ideal esta primavera</span>
      </div>

      <nav className="navbar navbar-expand-lg awsd-navbar sticky-top py-3">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src="/img/logo.jfif" alt="AWSDCraft.cl" className="navbar-logo-img" />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarAWSD"
            aria-controls="navbarAWSD"
            aria-expanded="false"
            aria-label="Abrir navegación"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarAWSD">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/productos">
                  Productos
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/categorias">
                  Categorías
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/ofertas">
                  Ofertas
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/blogs">
                  Blogs
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/contacto">
                  Contacto
                </NavLink>
              </li>

              {esAdministrador && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin">
                    Administración
                  </NavLink>
                </li>
              )}

              {usuario ? (
                <>
                  <li className="nav-item">
                    <span className="nav-link">Hola, {usuario.nombre}</span>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-outline-awsd btn-sm" onClick={salir}>
                      Cerrar sesión
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/login">
                      Iniciar sesión
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/registro">
                      Registrarse
                    </NavLink>
                  </li>
                </>
              )}

              <li className="nav-item">
                <Link className="nav-link cart-link" to="/carrito" aria-label="Carrito de compras">
                  <i className="bi bi-cart3"></i>
                  <span className="cart-badge">{cantidadTotal}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
