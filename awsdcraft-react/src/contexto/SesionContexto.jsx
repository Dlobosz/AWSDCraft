import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { EVENTO_SESION_EXPIRADA, EVENTO_SESION_RENOVADA } from "../servicios/api";
import * as authServicio from "../servicios/authServicio";
import {
  actualizarUsuarioGuardado,
  cerrarSesionGuardada,
  guardarSesion,
  leerSesion,
} from "../servicios/sesion";
import { ROLES, tienePermiso } from "../utilidades/permisos";

const SesionContexto = createContext(null);

/**
 * Estado global de autenticación.
 *  1. Al cargar la app lee la sesión guardada en sessionStorage (así sobrevive al F5).
 *  2. Si existe, la valida contra el backend (GET /auth/perfil) para confirmar que el token sigue
 *     siendo válido y obtener el rol actualizado. Si el token venció, el interceptor lo renueva.
 *  3. Escucha los eventos del interceptor: sesión renovada o sesión expirada.
 */
export function ProveedorSesion({ children }) {
  const [usuario, setUsuario] = useState(() => leerSesion()?.usuario ?? null);
  const [verificando, setVerificando] = useState(() => Boolean(leerSesion()));
  const [avisoSesion, setAvisoSesion] = useState("");

  useEffect(() => {
    if (!leerSesion()) return;
    let activo = true;

    authServicio
      .obtenerPerfil()
      .then((perfil) => {
        if (!activo) return;
        actualizarUsuarioGuardado(perfil);
        setUsuario(perfil);
      })
      .catch((error) => {
        // 401: el refresh también falló y el interceptor ya cerró la sesión.
        if (activo && error.response?.status === 401) setUsuario(null);
      })
      .finally(() => activo && setVerificando(false));

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    function alExpirar() {
      setUsuario(null);
      setAvisoSesion("Tu sesión expiró. Inicia sesión nuevamente.");
    }
    function alRenovar(evento) {
      if (evento.detail) setUsuario(evento.detail);
    }
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
    window.addEventListener(EVENTO_SESION_RENOVADA, alRenovar);
    return () => {
      window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
      window.removeEventListener(EVENTO_SESION_RENOVADA, alRenovar);
    };
  }, []);

  const iniciarSesion = useCallback(async (correo, password) => {
    const datos = await authServicio.login(correo, password);
    guardarSesion(datos);
    setUsuario(datos.usuario);
    setAvisoSesion("");
    return datos.usuario;
  }, []);

  const registrar = useCallback(async (datosRegistro) => {
    const datos = await authServicio.registrar(datosRegistro);
    guardarSesion(datos);
    setUsuario(datos.usuario);
    setAvisoSesion("");
    return datos.usuario;
  }, []);

  const cerrarSesion = useCallback(async () => {
    const sesion = leerSesion();
    cerrarSesionGuardada();
    setUsuario(null);
    if (sesion?.refreshToken) {
      // Revoca el refresh token en el servidor para que no pueda reutilizarse.
      await authServicio.logout(sesion.refreshToken).catch(() => {});
    }
  }, []);

  const valor = useMemo(
    () => ({
      usuario,
      verificando,
      avisoSesion,
      limpiarAviso: () => setAvisoSesion(""),
      esAdministrador: usuario?.rol === ROLES.ADMIN,
      esVendedor: usuario?.rol === ROLES.VENDEDOR,
      esPersonal: usuario?.rol === ROLES.ADMIN || usuario?.rol === ROLES.VENDEDOR,
      puede: (permiso) => tienePermiso(usuario, permiso),
      iniciarSesion,
      registrar,
      cerrarSesion,
    }),
    [usuario, verificando, avisoSesion, iniciarSesion, registrar, cerrarSesion]
  );

  return <SesionContexto.Provider value={valor}>{children}</SesionContexto.Provider>;
}

export function useSesion() {
  const contexto = useContext(SesionContexto);
  if (!contexto) throw new Error("useSesion debe usarse dentro de ProveedorSesion");
  return contexto;
}
