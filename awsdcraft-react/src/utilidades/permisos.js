// Matriz de permisos del frontend. Es la misma regla que aplica el backend con @PreAuthorize:
// el frontend la usa para MOSTRAR u OCULTAR pantallas, menús y botones; el backend la usa para
// PERMITIR o RECHAZAR (403) cada petición. Así, aunque alguien manipule el navegador, la API no
// entrega datos a un rol sin permiso.

export const ROLES = {
  ADMIN: "ADMIN",
  VENDEDOR: "VENDEDOR",
  CLIENTE: "CLIENTE",
};

export const ETIQUETAS_ROL = {
  ADMIN: "Administrador",
  VENDEDOR: "Vendedor",
  CLIENTE: "Cliente",
};

const { ADMIN, VENDEDOR } = ROLES;

export const PERMISOS = {
  panel: [ADMIN, VENDEDOR], // entrar a /admin
  dashboard: [ADMIN],
  verProductos: [ADMIN, VENDEDOR], // lista y detalle
  gestionarProductos: [ADMIN], // crear, editar, eliminar
  verOrdenes: [ADMIN, VENDEDOR], // lista y detalle
  gestionarOrdenes: [ADMIN], // cambiar estado, eliminar
  stockCritico: [ADMIN],
  categorias: [ADMIN],
  usuarios: [ADMIN],
  reportes: [ADMIN],
  perfil: [ADMIN],
};

export function tienePermiso(usuario, permiso) {
  return Boolean(usuario) && (PERMISOS[permiso] || []).includes(usuario.rol);
}

/**
 * Decide qué hacer al entrar a una ruta protegida:
 *  - "login": no hay sesión, se redirige al inicio de sesión.
 *  - "denegado": hay sesión pero el rol no está permitido.
 *  - "permitido": puede ver la pantalla.
 */
export function decidirAcceso(usuario, rolesPermitidos) {
  if (!usuario) return "login";
  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) return "denegado";
  return "permitido";
}

/** Pantalla a la que se envía a cada rol después de iniciar sesión. */
export function rutaInicial(usuario) {
  if (usuario?.rol === ADMIN) return "/admin";
  if (usuario?.rol === VENDEDOR) return "/admin/productos";
  return "/";
}

export function etiquetaRol(rol) {
  return ETIQUETAS_ROL[rol] || rol || "-";
}
