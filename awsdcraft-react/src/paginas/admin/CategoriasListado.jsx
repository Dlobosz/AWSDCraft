import { useState } from "react";
import { Link } from "react-router-dom";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { eliminarCategoria, listarCategorias } from "../../servicios/categoriasServicio";
import { listarPorCategoria } from "../../servicios/productosServicio";

export default function CategoriasListado() {
  const [categorias, setCategorias] = useState(listarCategorias);
  const [aviso, setAviso] = useState("");
  const [error, setError] = useState("");

  function borrar(categoria) {
    if (listarPorCategoria(categoria.slug).length > 0) {
      setAviso("");
      setError(`No puedes eliminar "${categoria.nombre}" porque tiene productos asociados.`);
      return;
    }
    if (!window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return;

    setError("");
    setCategorias(eliminarCategoria(categoria.id));
    setAviso(`La categoría "${categoria.nombre}" fue eliminada.`);
  }

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h1 className="awsd-title h3 mb-1">Categorías</h1>
          <p className="text-secondary small mb-0">{categorias.length} categorías registradas</p>
        </div>
        <Link to="/admin/categorias/nueva" className="btn btn-awsd">
          <i className="bi bi-plus-lg me-2"></i>Nueva categoría
        </Link>
      </div>

      <MensajeAlerta mensaje={aviso} tipo="success" />
      <MensajeAlerta mensaje={error} />

      <div className="table-responsive awsd-card border p-3">
        <table className="table admin-table align-middle mb-0">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Identificador</th>
              <th>Descripción</th>
              <th>Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.nombre}</td>
                <td>{categoria.slug}</td>
                <td>{categoria.descripcion}</td>
                <td>{listarPorCategoria(categoria.slug).length}</td>
                <td className="d-flex gap-2">
                  <Link
                    to={`/admin/categorias/${categoria.id}/editar`}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => borrar(categoria)}
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
