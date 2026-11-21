import MensajeAlerta from "./MensajeAlerta";

/** Muestra un indicador mientras se espera la respuesta de la API, o el error si falló. */
export default function EstadoCarga({ cargando, error, texto = "Cargando..." }) {
  if (cargando) {
    return (
      <div className="d-flex align-items-center gap-2 text-secondary py-4" role="status">
        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
        <span>{texto}</span>
      </div>
    );
  }
  if (error) return <MensajeAlerta mensaje={error} />;
  return null;
}
