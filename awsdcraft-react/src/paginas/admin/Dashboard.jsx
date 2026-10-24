import { Link } from "react-router-dom";
import { listarOrdenes, totalVendido } from "../../servicios/ordenesServicio";
import { listarCriticos, listarProductos } from "../../servicios/productosServicio";
import { listarUsuarios } from "../../servicios/usuariosServicio";
import { formatearPrecio } from "../../utilidades/formato";

const accesos = [
  { to: "/admin/ordenes", icono: "bi-receipt", titulo: "Órdenes", texto: "Gestión y seguimiento de las compras realizadas." },
  { to: "/admin/productos", icono: "bi-box-seam", titulo: "Productos", texto: "Administra inventario y detalles de los productos." },
  { to: "/admin/categorias", icono: "bi-tags", titulo: "Categorías", texto: "Organiza los productos para facilitar la navegación." },
  { to: "/admin/usuarios", icono: "bi-people", titulo: "Usuarios", texto: "Gestión de cuentas de usuario y sus roles." },
  { to: "/admin/reportes", icono: "bi-bar-chart", titulo: "Reportes", texto: "Informes sobre las operaciones del sistema." },
  { to: "/admin/perfil", icono: "bi-person-circle", titulo: "Perfil", texto: "Administración de la información personal." },
];

export default function Dashboard() {
  const productos = listarProductos();
  const usuarios = listarUsuarios();
  const ordenes = listarOrdenes();
  const criticos = listarCriticos();

  const tarjetas = [
    { titulo: "Órdenes", valor: ordenes.length, detalle: `Vendido: ${formatearPrecio(totalVendido())}` },
    {
      titulo: "Productos",
      valor: productos.length,
      detalle: `Inventario actual: ${productos.reduce((suma, p) => suma + p.stock, 0)}`,
    },
    { titulo: "Usuarios", valor: usuarios.length, detalle: "Cuentas registradas en el sistema" },
    { titulo: "Stock crítico", valor: criticos.length, detalle: "Productos bajo el mínimo definido" },
  ];

  return (
    <>
      <h1 className="awsd-title h3 mb-1">Dashboard</h1>
      <p className="text-secondary small mb-4">Resumen de las actividades diarias</p>

      <div className="row g-3 mb-4">
        {tarjetas.map((tarjeta) => (
          <div className="col-12 col-sm-6 col-xl-3" key={tarjeta.titulo}>
            <div className="admin-stat-card h-100">
              <p className="text-secondary small mb-1">{tarjeta.titulo}</p>
              <p className="stat-numero mb-1">{tarjeta.valor}</p>
              <p className="small text-secondary mb-0">{tarjeta.detalle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        {accesos.map((acceso) => (
          <div className="col-12 col-sm-6 col-xl-4" key={acceso.to}>
            <Link to={acceso.to} className="admin-stat-card h-100 d-block text-center">
              <i className={`bi ${acceso.icono} fs-3 text-awsd-accent`}></i>
              <h2 className="h6 mt-2 mb-1">{acceso.titulo}</h2>
              <p className="small text-secondary mb-0">{acceso.texto}</p>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
