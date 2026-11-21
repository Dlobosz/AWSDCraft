import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSesion } from "../contexto/SesionContexto";
import { etiquetaRol } from "../utilidades/permisos";

// Cada opción del menú declara el permiso que necesita. El VENDEDOR solo verá "Órdenes" y
// "Productos"; el resto de opciones ni siquiera se dibuja para su rol.
const enlaces = [
  { to: "/admin", texto: "Dashboard", icono: "bi-speedometer2", exacto: true, permiso: "dashboard" },
  { to: "/admin/ordenes", texto: "Órdenes", icono: "bi-receipt", permiso: "verOrdenes" },
  { to: "/admin/productos", texto: "Productos", icono: "bi-box-seam", permiso: "verProductos" },
  { to: "/admin/criticos", texto: "Stock crítico", icono: "bi-exclamation-triangle", permiso: "stockCritico" },
  { to: "/admin/categorias", texto: "Categorías", icono: "bi-tags", permiso: "categorias" },
  { to: "/admin/usuarios", texto: "Usuarios", icono: "bi-people", permiso: "usuarios" },
  { to: "/admin/reportes", texto: "Reportes", icono: "bi-bar-chart", permiso: "reportes" },
  { to: "/admin/perfil", texto: "Perfil", icono: "bi-person-circle", permiso: "perfil" },
];

export default function LayoutAdmin() {
  const { usuario, puede, cerrarSesion } = useSesion();
  const navegar = useNavigate();

  async function salir() {
    // Primero se sale del panel; si se borrara la sesión antes, la ruta protegida
    // redirigiría un instante a /login.
    navegar("/");
    await cerrarSesion();
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <NavLink className="navbar-brand d-block mb-3" to="/">
          <img src="/img/logo.jfif" alt="AWSDCraft.cl" className="navbar-logo-img" />
        </NavLink>

        <div className="small mb-3">
          <div className="fw-semibold">
            {usuario?.nombre} {usuario?.apellidos}
          </div>
          <span className="badge text-bg-light border">{etiquetaRol(usuario?.rol)}</span>
        </div>

        {enlaces
          .filter((enlace) => puede(enlace.permiso))
          .map((enlace) => (
            <NavLink key={enlace.to} to={enlace.to} end={enlace.exacto}>
              <i className={`bi ${enlace.icono}`}></i>
              {enlace.texto}
            </NavLink>
          ))}

        <hr />
        <NavLink to="/">
          <i className="bi bi-shop"></i>
          Ir a la tienda
        </NavLink>
        <button className="btn btn-outline-danger btn-sm w-100 mt-2" onClick={salir}>
          Cerrar sesión
        </button>
      </aside>

      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}
