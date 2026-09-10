const CATEGORIAS_PRODUCTO = ["teclados", "kits", "keycaps", "switches", "accesorios"];
const TIPOS_USUARIO = ["Administrador", "Vendedor", "Cliente"];

function protegerVistaAdmin() {
  const sesion = localStorage.getItem("awsdcraft_sesion");
  if (!sesion) {
    window.location.href = "../login.html";
  }
}
function obtenerProductosAdmin() {
  const guardado = localStorage.getItem("awsdcraft_admin_productos");
  if (!guardado) {
    guardarProductosAdmin(productos);
    return [...productos];
  }
  try {
    return JSON.parse(guardado);
  } catch (error) {
    console.error("Datos de productos (admin) corruptos, se reinician.", error);
    guardarProductosAdmin(productos);
    return [...productos];
  }
}

function guardarProductosAdmin(lista) {
  localStorage.setItem("awsdcraft_admin_productos", JSON.stringify(lista));
}

function obtenerProximoIdProducto() {
  const lista = obtenerProductosAdmin();
  return lista.length ? Math.max(...lista.map((p) => p.id)) + 1 : 1;
}

/* ---------- Usuarios ---------- */

function obtenerUsuariosAdmin() {
  const guardado = localStorage.getItem("awsdcraft_admin_usuarios");
  if (!guardado) {
    guardarUsuariosAdmin(usuariosSemilla);
    return [...usuariosSemilla];
  }
  try {
    return JSON.parse(guardado);
  } catch (error) {
    console.error("Datos de usuarios (admin) corruptos, se reinician.", error);
    guardarUsuariosAdmin(usuariosSemilla);
    return [...usuariosSemilla];
  }
}

function guardarUsuariosAdmin(lista) {
  localStorage.setItem("awsdcraft_admin_usuarios", JSON.stringify(lista));
}

function obtenerProximoIdUsuario() {
  const lista = obtenerUsuariosAdmin();
  return lista.length ? Math.max(...lista.map((u) => u.id)) + 1 : 1;
}