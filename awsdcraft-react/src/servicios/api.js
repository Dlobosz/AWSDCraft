import axios from "axios";
import { cerrarSesionGuardada, guardarSesion, leerSesion, tokenPorVencer } from "./sesion";

// URL del backend definida en .env (VITE_API_URL). Si no existe se usa la de desarrollo local.
export const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8090/api/v1";

export const EVENTO_SESION_EXPIRADA = "awsdcraft:sesion-expirada";
export const EVENTO_SESION_RENOVADA = "awsdcraft:sesion-renovada";

const RUTAS_AUTH = ["/auth/login", "/auth/registro", "/auth/refresh", "/auth/logout"];

/** Cliente axios único para toda la aplicación: las páginas nunca arman URLs ni headers a mano. */
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Cliente sin interceptores, solo para renovar el token (evita ciclos infinitos).
const clienteRenovacion = axios.create({ baseURL: API_URL, timeout: 10000 });

function esRutaAuth(url = "") {
  return RUTAS_AUTH.some((ruta) => url.startsWith(ruta));
}

let renovacionEnCurso = null;

/**
 * Pide un nuevo par de tokens con el refresh token (POST /auth/refresh).
 * Si varias peticiones necesitan renovar a la vez, todas esperan la misma promesa.
 * Si la renovación falla, la sesión se cierra y se avisa a la aplicación.
 */
export function renovarSesion() {
  const sesion = leerSesion();
  if (!sesion?.refreshToken) return Promise.reject(new Error("No hay sesión para renovar"));

  if (!renovacionEnCurso) {
    renovacionEnCurso = clienteRenovacion
      .post("/auth/refresh", { refreshToken: sesion.refreshToken })
      .then(({ data }) => {
        guardarSesion(data);
        window.dispatchEvent(new CustomEvent(EVENTO_SESION_RENOVADA, { detail: data.usuario }));
        return data;
      })
      .catch((error) => {
        cerrarSesionGuardada();
        window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
        throw error;
      })
      .finally(() => {
        renovacionEnCurso = null;
      });
  }
  return renovacionEnCurso;
}

// INTERCEPTOR DE PETICIÓN: agrega "Authorization: Bearer <token>" y renueva el token si está por vencer.
api.interceptors.request.use(async (config) => {
  let sesion = leerSesion();

  if (sesion && !esRutaAuth(config.url) && tokenPorVencer(sesion.accessToken)) {
    try {
      sesion = await renovarSesion();
    } catch {
      sesion = null;
    }
  }

  if (sesion?.accessToken) {
    config.headers.Authorization = `Bearer ${sesion.accessToken}`;
  }
  return config;
});

// INTERCEPTOR DE RESPUESTA: si el backend responde 401 (token vencido o revocado) se intenta
// renovar una sola vez y se repite la petición original de forma transparente para el usuario.
api.interceptors.response.use(
  (respuesta) => respuesta,
  async (error) => {
    const original = error.config;
    const puedeReintentar =
      error.response?.status === 401 &&
      original &&
      !original._reintentado &&
      !esRutaAuth(original.url) &&
      leerSesion()?.refreshToken;

    if (puedeReintentar) {
      original._reintentado = true;
      try {
        const nueva = await renovarSesion();
        original.headers.Authorization = `Bearer ${nueva.accessToken}`;
        return api(original);
      } catch {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

/** Extrae el mensaje legible que envía el backend en su ErrorResponse. */
export function mensajeError(error, porDefecto = "Ocurrió un error inesperado.") {
  if (!error?.response) {
    return "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
  }
  if (error.response.status === 403) {
    return error.response.data?.mensaje || "No tienes permisos para realizar esta acción.";
  }
  return error.response.data?.mensaje || porDefecto;
}

/** Errores por campo que devuelve el backend cuando falla una validación (HTTP 400). */
export function erroresDeCampo(error) {
  return error?.response?.data?.errores || {};
}

export default api;
