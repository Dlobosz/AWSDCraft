import { useCallback, useEffect, useState } from "react";
import { mensajeError } from "../servicios/api";

/**
 * Hook reutilizable para cargar datos desde la API al montar una página.
 * Devuelve { datos, cargando, error, estadoHttp, recargar, setDatos }.
 *
 * @param {() => Promise<any>} cargar función que llama a un servicio REST
 * @param {Array} dependencias vuelve a cargar cuando cambian (por ejemplo, el id de la URL)
 */
export function useCarga(cargar, dependencias = []) {
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: "", estadoHttp: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let activo = true;
    setEstado((actual) => ({ ...actual, cargando: true, error: "" }));

    cargar()
      .then((datos) => {
        if (activo) setEstado({ datos, cargando: false, error: "", estadoHttp: 200 });
      })
      .catch((error) => {
        if (activo) {
          setEstado({
            datos: null,
            cargando: false,
            error: mensajeError(error),
            estadoHttp: error.response?.status ?? null,
          });
        }
      });

    // Si el componente se desmonta antes de que llegue la respuesta, se ignora el resultado.
    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencias, version]);

  const recargar = useCallback(() => setVersion((v) => v + 1), []);
  const setDatos = useCallback(
    (cambio) =>
      setEstado((actual) => ({
        ...actual,
        datos: typeof cambio === "function" ? cambio(actual.datos) : cambio,
      })),
    []
  );

  return { ...estado, recargar, setDatos };
}
