import { regiones } from "../datos/regiones";

export default function SelectorRegionComuna({ region, comuna, onCambiarRegion, onCambiarComuna, errores = {} }) {
  const regionElegida = regiones.find((item) => item.nombre === region);

  return (
    <div className="row g-3">
      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="region">
          Región<span className="text-danger">*</span>
        </label>
        <select
          id="region"
          className={`form-select ${errores.region ? "is-invalid-awsd" : ""}`}
          value={region}
          onChange={(evento) => {
            onCambiarRegion(evento.target.value);
            onCambiarComuna("");
          }}
        >
          <option value="">-- Seleccione la región --</option>
          {regiones.map((item) => (
            <option key={item.nombre} value={item.nombre}>
              {item.nombre}
            </option>
          ))}
        </select>
        {errores.region && <div className="invalid-feedback-awsd d-block">{errores.region}</div>}
      </div>

      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="comuna">
          Comuna<span className="text-danger">*</span>
        </label>
        <select
          id="comuna"
          className={`form-select ${errores.comuna ? "is-invalid-awsd" : ""}`}
          value={comuna}
          disabled={!regionElegida}
          onChange={(evento) => onCambiarComuna(evento.target.value)}
        >
          <option value="">-- Seleccione la comuna --</option>
          {regionElegida &&
            regionElegida.comunas.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
        </select>
        {errores.comuna && <div className="invalid-feedback-awsd d-block">{errores.comuna}</div>}
      </div>
    </div>
  );
}
