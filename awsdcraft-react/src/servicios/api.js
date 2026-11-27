import axios from "axios";
import { cerrarSesionGuardada, guardarSesion, leerSesion } from "./sesion";

// URL del backend definida en .env (VITE_API_URL). Si no existe se usa la de desarrollo local.
export const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8090/api/v1";

// Evento que avisa a la aplicación que la sesión terminó (el refresh token ya no sirve).
export const EVENTO_SESION_EXPIRADA = "awsdcraft:sesion-expirada";

/** Cliente axios único: todas las páginas llaman al backend a través de él. */
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Rutas donde un 401 significa "credenciales incorrectas", no "token vencido": no se renueva.
const RUTAS_SIN_RENOVACION = ["/auth/login", "/auth/registro", "/auth/refresh", "/auth/logout"];

let renovacionEnCurso = null;

/**
 * Pide un nuevo par de tokens con el refresh token (POST /auth/refresh).
 * Si varias peticiones reciben 401 al mismo tiempo, todas esperan la misma renovación.
 */
function renovarSesion() {
  const sesion = leerSesion();

  if (!renovacionEnCurso) {
    renovacionEnCurso = axios
      .post(`${API_URL}/auth/refresh`, { refreshToken: sesion.refreshToken })
      .then(({ data }) => {
        guardarSesion(data);
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

// 1) Antes de cada petición: agrega "Authorization: Bearer <token>" si hay sesión.
api.interceptors.request.use((config) => {
  const sesion = leerSesion();
  if (sesion?.accessToken) {
    config.headers.Authorization = `Bearer ${sesion.accessToken}`;
  }
  return config;
});

// 2) Después de cada respuesta: si el backend responde 401 (token vencido), se renueva el token
//    una sola vez y se repite la petición original.
api.interceptors.response.use(
  (respuesta) => respuesta,
  async (error) => {
    const original = error.config;
    const puedeRenovar = original && !RUTAS_SIN_RENOVACION.includes(original.url);

    if (error.response?.status === 401 && puedeRenovar && !original._reintentado && leerSesion()) {
      original._reintentado = true;
      const nueva = await renovarSesion();
      original.headers.Authorization = `Bearer ${nueva.accessToken}`;
      return api(original);
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
