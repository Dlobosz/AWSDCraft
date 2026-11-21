import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSesion } from "../contexto/SesionContexto";
import { PERMISOS, decidirAcceso } from "../utilidades/permisos";
import AccesoDenegado from "./AccesoDenegado";
import EstadoCarga from "./EstadoCarga";

/**
 * Protege rutas del frontend según la sesión y el rol.
 *  - Sin sesión: redirige a /login recordando la página que se quería abrir.
 *  - Rol no permitido: muestra "Acceso denegado".
 *  - Permitido: muestra el contenido (children o las rutas hijas con <Outlet />).
 *
 * Uso: <RutaProtegida permiso="usuarios"> o <RutaProtegida roles={["ADMIN"]}>
 */
export default function RutaProtegida({ permiso, roles, children }) {
  const { usuario, verificando } = useSesion();
  const ubicacion = useLocation();

  // Mientras se valida con el backend la sesión guardada, no se decide nada (evita parpadeos).
  if (verificando) return <EstadoCarga cargando texto="Verificando sesión..." />;

  const rolesPermitidos = permiso ? PERMISOS[permiso] : roles;
  const decision = decidirAcceso(usuario, rolesPermitidos);

  if (decision === "login") {
    return (
      <Navigate
        to="/login"
        replace
        state={{ desde: ubicacion.pathname, motivo: "Debes iniciar sesión para acceder a esa página." }}
      />
    );
  }
  if (decision === "denegado") return <AccesoDenegado />;

  return children ?? <Outlet />;
}
