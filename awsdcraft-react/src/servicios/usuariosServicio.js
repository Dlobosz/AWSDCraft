import { usuariosSemilla } from "../datos/usuarios";
import { CLAVES, guardar, iniciarColeccion, proximoId } from "./almacenamiento";

export function listarUsuarios() {
  return iniciarColeccion(CLAVES.usuarios, usuariosSemilla);
}

export function obtenerUsuario(id) {
  return listarUsuarios().find((usuario) => usuario.id === Number(id)) || null;
}

export function buscarPorCorreo(correo) {
  const texto = String(correo || "").trim().toLowerCase();
  return listarUsuarios().find((usuario) => usuario.correo.toLowerCase() === texto) || null;
}

export function crearUsuario(datos) {
  const lista = listarUsuarios();
  const nuevo = { ...datos, id: proximoId(lista) };
  guardar(CLAVES.usuarios, [...lista, nuevo]);
  return nuevo;
}

export function actualizarUsuario(id, datos) {
  const lista = listarUsuarios();
  const actualizada = lista.map((usuario) =>
    usuario.id === Number(id) ? { ...usuario, ...datos, id: Number(id) } : usuario
  );
  guardar(CLAVES.usuarios, actualizada);
  return actualizada.find((usuario) => usuario.id === Number(id)) || null;
}

export function eliminarUsuario(id) {
  const lista = listarUsuarios();
  const actualizada = lista.filter((usuario) => usuario.id !== Number(id));
  guardar(CLAVES.usuarios, actualizada);
  return actualizada;
}
