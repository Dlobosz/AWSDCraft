export default function FiltroCategorias({ categorias, seleccionada, onSeleccionar }) {
  return (
    <div className="d-flex flex-wrap gap-2">
      <button
        type="button"
        className={`category-pill ${seleccionada === "todas" ? "active" : ""}`}
        onClick={() => onSeleccionar("todas")}
      >
        Todas
      </button>
      {categorias.map((categoria) => (
        <button
          type="button"
          key={categoria.id}
          className={`category-pill ${seleccionada === categoria.slug ? "active" : ""}`}
          onClick={() => onSeleccionar(categoria.slug)}
        >
          {categoria.nombre}
        </button>
      ))}
    </div>
  );
}
