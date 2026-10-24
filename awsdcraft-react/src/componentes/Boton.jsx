export default function Boton({
  etiqueta,
  onClick,
  tipo = "button",
  variante = "btn-awsd",
  icono = "",
  deshabilitado = false,
  className = "",
}) {
  return (
    <button
      type={tipo}
      className={`btn ${variante} ${className}`}
      onClick={onClick}
      disabled={deshabilitado}
    >
      {icono && <i className={`bi ${icono} me-2`}></i>}
      {etiqueta}
    </button>
  );
}
