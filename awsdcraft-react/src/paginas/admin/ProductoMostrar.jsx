import { Link, useParams } from "react-router-dom";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { obtenerProducto } from "../../servicios/productosServicio";
import { formatearPrecio, precioConDescuento } from "../../utilidades/formato";

export default function ProductoMostrar() {
  const { id } = useParams();
  const producto = obtenerProducto(id);

  if (!producto) {
    return (
      <>
        <MensajeAlerta mensaje="El producto solicitado no existe." tipo="warning" />
        <Link to="/admin/productos" className="btn btn-awsd">
          Volver al listado
        </Link>
      </>
    );
  }

  const filas = [
    ["Código", producto.codigo],
    ["Nombre", producto.nombre],
    ["Categoría", producto.categoria],
    ["Precio", formatearPrecio(producto.precio)],
    ["Descuento", `${producto.descuento || 0}%`],
    ["Precio final", formatearPrecio(precioConDescuento(producto))],
    ["Stock", producto.stock],
    ["Stock crítico", producto.stockCritico],
    ["Switch", producto.switch],
    ["Destacado", producto.destacado ? "Sí" : "No"],
  ];

  return (
    <>
      <h1 className="awsd-title h3 mb-4">Detalle del producto</h1>

      <div className="awsd-card border p-4">
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <img
              src={`/img/${producto.imagen}`}
              alt={producto.nombre}
              className="img-fluid rounded-4 border"
            />
          </div>
          <div className="col-12 col-md-8">
            <table className="table admin-table mb-4">
              <tbody>
                {filas.map(([etiqueta, valor]) => (
                  <tr key={etiqueta}>
                    <th className="w-25">{etiqueta}</th>
                    <td>{valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-secondary">{producto.descripcion}</p>

            <div className="d-flex gap-2">
              <Link to={`/admin/productos/${producto.id}/editar`} className="btn btn-awsd">
                Editar producto
              </Link>
              <Link to="/admin/productos" className="btn btn-outline-secondary">
                Volver
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
