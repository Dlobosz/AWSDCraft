import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BuscadorProductos from "../../componentes/BuscadorProductos";
import EstadoCarga from "../../componentes/EstadoCarga";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { useSesion } from "../../contexto/SesionContexto";
import { useCarga } from "../../hooks/useCarga";
import { mensajeError } from "../../servicios/api";
import { buscarProductos, eliminarProducto, listarProductos } from "../../servicios/productosServicio";
import { formatearPrecio } from "../../utilidades/formato";

/** Visible para ADMIN y VENDEDOR; solo el ADMIN ve los botones Nuevo, Editar y Eliminar. */
export default function ProductosListado() {
  const ubicacion = useLocation();
  const { puede } = useSesion();
  const puedeGestionar = puede("gestionarProductos");

  const { datos: productos, cargando, error, setDatos } = useCarga(listarProductos);
  const [termino, setTermino] = useState("");
  const [aviso, setAviso] = useState(ubicacion.state?.aviso ?? "");
  const [errorAccion, setErrorAccion] = useState("");

  const visibles = buscarProductos(productos ?? [], termino);

  async function borrar(producto) {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return;
    setErrorAccion("");
    try {
      await eliminarProducto(producto.id); // DELETE /api/v1/productos/{id}
      setDatos((actuales) => actuales.filter((item) => item.id !== producto.id));
      setAviso(`El producto "${producto.nombre}" fue eliminado.`);
    } catch (e) {
      setAviso("");
      setErrorAccion(mensajeError(e)); // p. ej. 409 si tiene ventas registradas
    }
  }

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h1 className="awsd-title h3 mb-1">Productos</h1>
          <p className="text-secondary small mb-0">{visibles.length} productos en el catálogo</p>
        </div>
        {puedeGestionar && (
          <Link to="/admin/productos/nuevo" className="btn btn-awsd">
            <i className="bi bi-plus-lg me-2"></i>Nuevo producto
          </Link>
        )}
      </div>

      <div className="mb-3 col-12 col-lg-5">
        <BuscadorProductos onBuscar={setTermino} />
      </div>

      <MensajeAlerta mensaje={aviso} tipo="success" />
      <MensajeAlerta mensaje={errorAccion} />
      <EstadoCarga cargando={cargando} error={error} texto="Cargando productos..." />

      {productos && (
        <div className="table-responsive awsd-card border p-3">
          <table className="table admin-table align-middle mb-0">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.codigo}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoriaNombre}</td>
                  <td>{formatearPrecio(producto.precio)}</td>
                  <td>
                    {producto.stock}
                    {producto.critico && <span className="badge-stock-critico ms-2">crítico</span>}
                  </td>
                  <td className="d-flex gap-2">
                    <Link
                      to={`/admin/productos/${producto.id}`}
                      className="btn btn-sm btn-outline-awsd"
                    >
                      Ver
                    </Link>
                    {puedeGestionar && (
                      <>
                        <Link
                          to={`/admin/productos/${producto.id}/editar`}
                          className="btn btn-sm btn-outline-secondary"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => borrar(producto)}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
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
