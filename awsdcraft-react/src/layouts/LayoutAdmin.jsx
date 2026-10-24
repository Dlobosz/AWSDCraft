import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSesion } from "../contexto/SesionContexto";

const enlaces = [
  { to: "/admin", texto: "Dashboard", icono: "bi-speedometer2", exacto: true },
  { to: "/admin/ordenes", texto: "Órdenes", icono: "bi-receipt" },
  { to: "/admin/productos", texto: "Productos", icono: "bi-box-seam" },
  { to: "/admin/criticos", texto: "Stock crítico", icono: "bi-exclamation-triangle" },
  { to: "/admin/categorias", texto: "Categorías", icono: "bi-tags" },
  { to: "/admin/usuarios", texto: "Usuarios", icono: "bi-people" },
  { to: "/admin/reportes", texto: "Reportes", icono: "bi-bar-chart" },
  { to: "/admin/perfil", texto: "Perfil", icono: "bi-person-circle" },
];

export default function LayoutAdmin() {
  const { esAdministrador, cerrarSesion } = useSesion();
  const navegar = useNavigate();

  if (!esAdministrador) return <Navigate to="/login" replace />;

  function salir() {
    cerrarSesion();
    navegar("/");
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <NavLink className="navbar-brand d-block mb-4" to="/admin">
          <img src="/img/logo.jfif" alt="AWSDCraft.cl" className="navbar-logo-img" />
        </NavLink>

        {enlaces.map((enlace) => (
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
