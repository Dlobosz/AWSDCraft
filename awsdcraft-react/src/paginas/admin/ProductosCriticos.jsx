import { Link } from "react-router-dom";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { listarCriticos } from "../../servicios/productosServicio";

export default function ProductosCriticos() {
  const criticos = listarCriticos();

  return (
    <>
      <h1 className="awsd-title h3 mb-1">Productos con stock crítico</h1>
      <p className="text-secondary small mb-4">
        Productos cuyo stock actual llegó al mínimo definido.
      </p>

      {criticos.length === 0 ? (
        <MensajeAlerta mensaje="No hay productos en stock crítico." tipo="success" />
      ) : (
        <div className="table-responsive awsd-card border p-3">
          <table className="table admin-table align-middle mb-0">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Stock actual</th>
                <th>Stock crítico</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {criticos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.codigo}</td>
                  <td>{producto.nombre}</td>
                  <td>
                    <span className="badge-stock-critico">{producto.stock}</span>
                  </td>
                  <td>{producto.stockCritico}</td>
                  <td>
                    <Link
                      to={`/admin/productos/${producto.id}/editar`}
                      className="btn btn-sm btn-outline-awsd"
                    >
                      Reponer stock
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
