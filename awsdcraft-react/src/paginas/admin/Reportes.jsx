import { listarOrdenes, totalVendido } from "../../servicios/ordenesServicio";
import { listarCategorias } from "../../servicios/categoriasServicio";
import { listarPorCategoria, listarProductos } from "../../servicios/productosServicio";
import { formatearPrecio } from "../../utilidades/formato";

function contarUnidadesVendidas(ordenes) {
  const conteo = {};

  ordenes
    .filter((orden) => orden.estado === "Pagada")
    .forEach((orden) => {
      orden.items.forEach((item) => {
        conteo[item.nombre] = (conteo[item.nombre] || 0) + item.cantidad;
      });
    });

  return Object.entries(conteo).sort((a, b) => b[1] - a[1]);
}

export default function Reportes() {
  const ordenes = listarOrdenes();
  const productos = listarProductos();
  const categorias = listarCategorias();
  const masVendidos = contarUnidadesVendidas(ordenes);

  const pagadas = ordenes.filter((orden) => orden.estado === "Pagada").length;
  const rechazadas = ordenes.filter((orden) => orden.estado === "Rechazada").length;

  return (
    <>
      <h1 className="awsd-title h3 mb-1">Reportes</h1>
      <p className="text-secondary small mb-4">Informe general de ventas e inventario</p>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="admin-stat-card h-100">
            <p className="text-secondary small mb-1">Total vendido</p>
            <p className="stat-numero mb-0">{formatearPrecio(totalVendido())}</p>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="admin-stat-card h-100">
            <p className="text-secondary small mb-1">Órdenes pagadas</p>
            <p className="stat-numero mb-0">{pagadas}</p>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="admin-stat-card h-100">
            <p className="text-secondary small mb-1">Órdenes rechazadas</p>
            <p className="stat-numero mb-0">{rechazadas}</p>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="awsd-card border p-3 h-100">
            <h2 className="h6 awsd-title mb-3">Productos más vendidos</h2>
            {masVendidos.length === 0 ? (
              <p className="text-secondary small mb-0">Aún no hay ventas registradas.</p>
            ) : (
              <table className="table admin-table mb-0">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Unidades</th>
                  </tr>
                </thead>
                <tbody>
                  {masVendidos.map(([nombre, cantidad]) => (
                    <tr key={nombre}>
                      <td>{nombre}</td>
                      <td>{cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="awsd-card border p-3 h-100">
            <h2 className="h6 awsd-title mb-3">Inventario por categoría</h2>
            <table className="table admin-table mb-0">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Productos</th>
                  <th>Unidades</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((categoria) => {
                  const deCategoria = listarPorCategoria(categoria.slug);
                  return (
                    <tr key={categoria.id}>
                      <td>{categoria.nombre}</td>
                      <td>{deCategoria.length}</td>
                      <td>{deCategoria.reduce((suma, p) => suma + p.stock, 0)}</td>
                    </tr>
                  );
                })}
                <tr>
                  <th>Total</th>
                  <th>{productos.length}</th>
                  <th>{productos.reduce((suma, p) => suma + p.stock, 0)}</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
