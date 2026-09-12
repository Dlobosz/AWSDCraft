const CATEGORIAS_PRODUCTO = ["teclados", "kits", "keycaps", "switches", "accesorios"];
const TIPOS_USUARIO = ["Administrador", "Vendedor", "Cliente"];

function protegerVistaAdmin() {
  const sesionGuardada = localStorage.getItem("awsdcraft_sesion");
  if (!sesionGuardada) {
    window.location.href = "../login.html";
    return;
  }

  try {
    const sesion = JSON.parse(sesionGuardada);
    if (sesion.tipoUsuario !== "Administrador") {
      window.location.href = "../login.html";
    }
  } catch (error) {
    // Sesión corrupta: por seguridad, tratamos como "no autenticado".
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