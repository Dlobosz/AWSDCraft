import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CLAVES, guardar, leer } from "../servicios/almacenamiento";
import {
  agregarItem,
  calcularTotal,
  cambiarCantidad,
  contarItems,
  quitarItem,
} from "../servicios/carritoServicio";

const CarritoContexto = createContext(null);

export function ProveedorCarrito({ children }) {
  const [items, setItems] = useState(() => leer(CLAVES.carrito, []));

  useEffect(() => {
    guardar(CLAVES.carrito, items);
  }, [items]);

  const valor = useMemo(
    () => ({
      items,
      total: calcularTotal(items),
      cantidadTotal: contarItems(items),
      agregar: (producto, cantidad) => setItems((actual) => agregarItem(actual, producto, cantidad)),
      quitar: (id) => setItems((actual) => quitarItem(actual, id)),
      cambiarCantidad: (id, cantidad) =>
        setItems((actual) => cambiarCantidad(actual, id, cantidad)),
      vaciar: () => setItems([]),
    }),
    [items]
  );

  return <CarritoContexto.Provider value={valor}>{children}</CarritoContexto.Provider>;
}

export function useCarrito() {
  const contexto = useContext(CarritoContexto);
  if (!contexto) throw new Error("useCarrito debe usarse dentro de ProveedorCarrito");
  return contexto;
}
