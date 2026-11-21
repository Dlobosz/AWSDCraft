// Gestión de la sesión en el navegador.
//
// Se usa sessionStorage (y no localStorage) porque:
//  - sobrevive a las recargas de página (F5), que es lo que exige la evaluación;
//  - se borra al cerrar la pestaña, reduciendo el tiempo que un token queda guardado;
//  - no se comparte entre pestañas ni queda en el equipo después de cerrar el navegador.
//
// Se guarda: accessToken (JWT de 15 min), refreshToken (para renovarlo) y los datos del usuario.

const CLAVE_SESION = "awsdcraft_sesion";

export function guardarSesion({ accessToken, refreshToken, usuario }) {
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify({ accessToken, refreshToken, usuario }));
}

export function leerSesion() {
  try {
    const texto = sessionStorage.getItem(CLAVE_SESION);
    if (!texto) return null;

    const sesion = JSON.parse(texto);
    if (!sesion?.accessToken || !sesion?.refreshToken || !sesion?.usuario) {
      cerrarSesionGuardada();
      return null;
    }
    return sesion;
  } catch {
    // Datos corruptos o manipulados: se descarta la sesión.
    cerrarSesionGuardada();
    return null;
  }
}

export function actualizarUsuarioGuardado(usuario) {
  const sesion = leerSesion();
  if (sesion) guardarSesion({ ...sesion, usuario });
}

export function cerrarSesionGuardada() {
  sessionStorage.removeItem(CLAVE_SESION);
}

/**
 * Lee el contenido (payload) del JWT. Solo se usa para saber cuándo vence y renovarlo a tiempo:
 * el frontend NO puede comprobar la firma; esa validación la hace siempre el backend.
 */
export function leerPayload(token) {
  try {
    const parte = token.split(".")[1];
    const base64 = parte.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** true si el token ya venció o vence dentro del margen indicado (por defecto 30 s). */
export function tokenPorVencer(token, margenSegundos = 30) {
  const payload = leerPayload(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 - margenSegundos * 1000 <= Date.now();
}
