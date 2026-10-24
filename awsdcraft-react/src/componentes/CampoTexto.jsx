export default function CampoTexto({
  id,
  etiqueta,
  valor,
  onChange,
  tipo = "text",
  error = "",
  marcaAgua = "",
  requerido = false,
}) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>
        {etiqueta}
        {requerido && <span className="text-danger">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={tipo}
        className={`form-control ${error ? "is-invalid-awsd" : ""}`}
        value={valor}
        placeholder={marcaAgua}
        onChange={(evento) => onChange(evento.target.value)}
      />
      {error && <div className="invalid-feedback-awsd d-block">{error}</div>}
    </div>
  );
}
