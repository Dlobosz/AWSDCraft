import { useState } from "react";
import { Link } from "react-router-dom";
import BuscadorProductos from "../../componentes/BuscadorProductos";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { buscarProductos, eliminarProducto, listarProductos } from "../../servicios/productosServicio";
import { formatearPrecio } from "../../utilidades/formato";

export default function ProductosListado() {
  const [productos, setProductos] = useState(listarProductos);
  const [termino, setTermino] = useState("");
  const [aviso, setAviso] = useState("");

  const visibles = buscarProductos(productos, termino);

  function borrar(producto) {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return;
    setProductos(eliminarProducto(producto.id));
    setAviso(`El producto "${producto.nombre}" fue eliminado.`);
  }

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h1 className="awsd-title h3 mb-1">Productos</h1>
          <p className="text-secondary small mb-0">{visibles.length} productos en el catálogo</p>
        </div>
        <Link to="/admin/productos/nuevo" className="btn btn-awsd">
          <i className="bi bi-plus-lg me-2"></i>Nuevo producto
        </Link>
      </div>

      <div className="mb-3 col-12 col-lg-5">
        <BuscadorProductos onBuscar={setTermino} />
      </div>

      <MensajeAlerta mensaje={aviso} tipo="success" />

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
                <td>{producto.categoria}</td>
                <td>{formatearPrecio(producto.precio)}</td>
                <td>
                  {producto.stock}
                  {producto.stock <= producto.stockCritico && (
                    <span className="badge-stock-critico ms-2">crítico</span>
                  )}
                </td>
                <td className="d-flex gap-2">
                  <Link
                    to={`/admin/productos/${producto.id}`}
                    className="btn btn-sm btn-outline-awsd"
                  >
                    Ver
                  </Link>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
