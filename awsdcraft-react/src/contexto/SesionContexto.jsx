import { createContext, useContext, useMemo, useState } from "react";
import { CLAVES, eliminar, guardar, leer } from "../servicios/almacenamiento";
import { buscarPorCorreo } from "../servicios/usuariosServicio";

const SesionContexto = createContext(null);

export function ProveedorSesion({ children }) {
  const [usuario, setUsuario] = useState(() => leer(CLAVES.sesion, null));

  const valor = useMemo(
    () => ({
      usuario,
      esAdministrador: Boolean(usuario) && usuario.tipoUsuario === "Administrador",
      iniciarSesion: (correo) => {
        const encontrado = buscarPorCorreo(correo);
        const sesion = encontrado || {
          nombre: correo.split("@")[0],
          apellidos: "",
          correo,
          tipoUsuario: "Cliente",
          region: "",
          comuna: "",
          direccion: "",
        };
        guardar(CLAVES.sesion, sesion);
        setUsuario(sesion);
        return sesion;
      },
      cerrarSesion: () => {
        eliminar(CLAVES.sesion);
        setUsuario(null);
      },
    }),
    [usuario]
  );

  return <SesionContexto.Provider value={valor}>{children}</SesionContexto.Provider>;
}

export function useSesion() {
  const contexto = useContext(SesionContexto);
  if (!contexto) throw new Error("useSesion debe usarse dentro de ProveedorSesion");
  return contexto;
}
