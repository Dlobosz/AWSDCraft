import { useState } from "react";

export default function BuscadorProductos({ onBuscar }) {
  const [termino, setTermino] = useState("");

  function manejarCambio(evento) {
    const valor = evento.target.value;
    setTermino(valor);
    onBuscar(valor);
  }

  return (
    <div className="input-group">
      <span className="input-group-text bg-white">
        <i className="bi bi-search"></i>
      </span>
      <input
        id="buscador"
        type="search"
        className="form-control"
        placeholder="Buscar por nombre o código"
        value={termino}
        onChange={manejarCambio}
      />
    </div>
  );
}
