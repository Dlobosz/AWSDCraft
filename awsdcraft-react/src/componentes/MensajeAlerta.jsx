export default function MensajeAlerta({ mensaje, tipo = "danger" }) {
  if (!mensaje) return null;

  return (
    <div className={`alert alert-${tipo}`} role="alert">
      {mensaje}
    </div>
  );
}
