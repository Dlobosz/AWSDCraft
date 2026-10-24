export default function ControlCantidad({ cantidad, maximo, onCambiar }) {
  function ajustar(delta) {
    const nueva = Math.max(1, Math.min(cantidad + delta, maximo));
    onCambiar(nueva);
  }

  return (
    <div className="qty-control">
      <button type="button" aria-label="Disminuir" onClick={() => ajustar(-1)}>
        -
      </button>
      <input
        type="number"
        value={cantidad}
        min="1"
        max={maximo}
        onChange={(evento) => onCambiar(Number(evento.target.value))}
      />
      <button type="button" aria-label="Aumentar" onClick={() => ajustar(1)}>
        +
      </button>
    </div>
  );
}
