import { Link, useParams } from "react-router-dom";
import EstadoCarga from "../../componentes/EstadoCarga";
import { useSesion } from "../../contexto/SesionContexto";
import { useCarga } from "../../hooks/useCarga";
import { obtenerProducto } from "../../servicios/productosServicio";
import { formatearPrecio } from "../../utilidades/formato";

/** Detalle de producto: lo ven ADMIN y VENDEDOR; el botón Editar solo aparece para ADMIN. */
export default function ProductoMostrar() {
  const { id } = useParams();
  const { puede } = useSesion();
  const { datos: producto, cargando, error } = useCarga(() => obtenerProducto(id), [id]);

  if (cargando || error) {
    return (
      <>
        <EstadoCarga cargando={cargando} error={error} texto="Cargando producto..." />
        {error && (
          <Link to="/admin/productos" className="btn btn-awsd">
            Volver al listado
          </Link>
        )}
      </>
    );
  }

  const filas = [
    ["Código", producto.codigo],
    ["Nombre", producto.nombre],
    ["Categoría", producto.categoriaNombre],
    ["Precio", formatearPrecio(producto.precio)],
    ["Descuento", `${producto.descuento || 0}%`],
    ["Precio final", formatearPrecio(producto.precioFinal)],
    ["Stock", producto.critico ? `${producto.stock} (crítico)` : producto.stock],
    ["Stock crítico", producto.stockCritico],
    ["Switch", producto.tipoSwitch],
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
              {puede("gestionarProductos") && (
                <Link to={`/admin/productos/${producto.id}/editar`} className="btn btn-awsd">
                  Editar producto
                </Link>
              )}
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
