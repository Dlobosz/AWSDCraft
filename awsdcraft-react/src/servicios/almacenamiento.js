// Persistencia local del carrito de compras (no es información sensible y debe sobrevivir
// aunque el cliente cierre el navegador). Los datos del negocio viven en el backend.
export const CLAVES = {
  carrito: "awsdcraft_carrito",
};

export function leer(clave, valorPorDefecto) {
  try {
    const guardado = localStorage.getItem(clave);
    if (!guardado) return valorPorDefecto;
    return JSON.parse(guardado);
  } catch {
    return valorPorDefecto;
  }
}

export function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

export function eliminar(clave) {
  localStorage.removeItem(clave);
}
