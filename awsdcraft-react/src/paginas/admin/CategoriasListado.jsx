import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import EstadoCarga from "../../componentes/EstadoCarga";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { useCarga } from "../../hooks/useCarga";
import { mensajeError } from "../../servicios/api";
import { eliminarCategoria, listarCategorias } from "../../servicios/categoriasServicio";

export default function CategoriasListado() {
  const ubicacion = useLocation();
  const { datos: categorias, cargando, error, setDatos } = useCarga(listarCategorias);
  const [aviso, setAviso] = useState(ubicacion.state?.aviso ?? "");
  const [errorAccion, setErrorAccion] = useState("");

  async function borrar(categoria) {
    if (!window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return;
    setErrorAccion("");
    try {
      await eliminarCategoria(categoria.id); // DELETE /api/v1/categorias/{id}
      setDatos((actuales) => actuales.filter((item) => item.id !== categoria.id));
      setAviso(`La categoría "${categoria.nombre}" fue eliminada.`);
    } catch (e) {
      // El backend responde 409 si la categoría todavía tiene productos.
      setAviso("");
      setErrorAccion(mensajeError(e));
    }
  }

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h1 className="awsd-title h3 mb-1">Categorías</h1>
          <p className="text-secondary small mb-0">
            {categorias?.length ?? 0} categorías registradas
          </p>
        </div>
        <Link to="/admin/categorias/nueva" className="btn btn-awsd">
          <i className="bi bi-plus-lg me-2"></i>Nueva categoría
        </Link>
      </div>

      <MensajeAlerta mensaje={aviso} tipo="success" />
      <MensajeAlerta mensaje={errorAccion} />
      <EstadoCarga cargando={cargando} error={error} />

      {categorias && (
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
                  <td>{categoria.cantidadProductos}</td>
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
      )}
    </>
  );
}
