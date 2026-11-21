import EstadoCarga from "../../componentes/EstadoCarga";
import { useCarga } from "../../hooks/useCarga";
import { obtenerResumen } from "../../servicios/reportesServicio";
import { formatearPrecio } from "../../utilidades/formato";

export default function Reportes() {
  // Los cálculos (sumas, agrupaciones y ranking) los hace el backend con consultas JPQL.
  const { datos: resumen, cargando, error } = useCarga(obtenerResumen);

  return (
    <>
      <h1 className="awsd-title h3 mb-1">Reportes</h1>
      <p className="text-secondary small mb-4">Informe general de ventas e inventario</p>

      <EstadoCarga cargando={cargando} error={error} texto="Generando reporte..." />

      {resumen && (
        <>
          <div className="row g-3 mb-4">
            {[
              ["Total vendido", formatearPrecio(resumen.totalVendido)],
              ["Órdenes pagadas", resumen.boletasPagadas],
              ["Órdenes enviadas", resumen.boletasEnviadas],
              ["Órdenes rechazadas", resumen.boletasRechazadas],
              ["Órdenes anuladas", resumen.boletasAnuladas],
            ].map(([titulo, valor]) => (
              <div className="col-12 col-sm-6 col-xl" key={titulo}>
                <div className="admin-stat-card h-100">
                  <p className="text-secondary small mb-1">{titulo}</p>
                  <p className="stat-numero mb-0">{valor}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-3">
            <div className="col-12 col-lg-6">
              <div className="awsd-card border p-3 h-100">
                <h2 className="h6 awsd-title mb-3">Productos más vendidos</h2>
                {resumen.masVendidos.length === 0 ? (
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
                      {resumen.masVendidos.map((item) => (
                        <tr key={item.nombre}>
                          <td>{item.nombre}</td>
                          <td>{item.unidades}</td>
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
                    {resumen.inventarioPorCategoria.map((fila) => (
                      <tr key={fila.categoria}>
                        <td>{fila.categoria}</td>
                        <td>{fila.productos}</td>
                        <td>{fila.unidades}</td>
                      </tr>
                    ))}
                    <tr>
                      <th>Total</th>
                      <th>{resumen.totalProductos}</th>
                      <th>{resumen.unidadesInventario}</th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
