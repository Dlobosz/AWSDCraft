import { Link } from "react-router-dom";
import { useSesion } from "../contexto/SesionContexto";
import { etiquetaRol, rutaInicial } from "../utilidades/permisos";

/** Pantalla que se muestra cuando un usuario con sesión intenta abrir una ruta de otro rol. */
export default function AccesoDenegado() {
  const { usuario } = useSesion();

  return (
    <section className="container py-5 text-center">
      <i className="bi bi-shield-lock fs-1 text-danger"></i>
      <h1 className="awsd-title h3 mt-3">Acceso denegado</h1>
      <p className="text-secondary mb-4">
        Tu rol <strong>{etiquetaRol(usuario?.rol)}</strong> no tiene permisos para ver esta sección.
      </p>
      <Link to={rutaInicial(usuario)} className="btn btn-awsd">
        Volver a mi inicio
      </Link>
    </section>
  );
}
