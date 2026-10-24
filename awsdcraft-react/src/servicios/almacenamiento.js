export const CLAVES = {
  productos: "awsdcraft_productos",
  usuarios: "awsdcraft_usuarios",
  categorias: "awsdcraft_categorias",
  ordenes: "awsdcraft_ordenes",
  carrito: "awsdcraft_carrito",
  sesion: "awsdcraft_sesion",
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

export function iniciarColeccion(clave, semilla) {
  const actual = leer(clave, null);
  if (actual === null) {
    guardar(clave, semilla);
    return [...semilla];
  }
  return actual;
}

export function proximoId(lista) {
  return lista.length ? Math.max(...lista.map((item) => Number(item.id))) + 1 : 1;
}
