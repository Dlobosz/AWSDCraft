import { useLocation } from "react-router-dom";
import { useSesion } from "../contexto/SesionContexto";
import { leerUltimaBoleta, obtenerOrden } from "../servicios/ordenesServicio";
import { useCarga } from "./useCarga";

/**
 * Obtiene la boleta que se muestra después de pagar:
 *  1. desde el estado de la navegación (recién creada en el checkout);
 *  2. si se recargó la página, desde la última boleta guardada en la pestaña;
 *  3. si hay sesión iniciada, consultándola a la API (GET /boletas/{id}).
 */
export function useBoletaCompra(id) {
  const ubicacion = useLocation();
  const { usuario } = useSesion();

  const { datos, cargando, error } = useCarga(() => {
    const local = ubicacion.state?.boleta ?? leerUltimaBoleta(id);
    if (local && String(local.id) === String(id)) return Promise.resolve(local);
    if (usuario) return obtenerOrden(id);
    return Promise.resolve(null);
  }, [id]);

  return { boleta: datos, cargando, error };
}
