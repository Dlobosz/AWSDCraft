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
