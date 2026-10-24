import { categoriasSemilla } from "../datos/categorias";
import { CLAVES, guardar, iniciarColeccion, proximoId } from "./almacenamiento";

export function listarCategorias() {
  return iniciarColeccion(CLAVES.categorias, categoriasSemilla);
}

export function obtenerCategoria(slug) {
  return listarCategorias().find((categoria) => categoria.slug === slug) || null;
}

export function crearCategoria(datos) {
  const lista = listarCategorias();
  const nueva = { ...datos, id: proximoId(lista) };
  guardar(CLAVES.categorias, [...lista, nueva]);
  return nueva;
}

export function actualizarCategoria(id, datos) {
  const lista = listarCategorias();
  const actualizada = lista.map((categoria) =>
    categoria.id === Number(id) ? { ...categoria, ...datos, id: Number(id) } : categoria
  );
  guardar(CLAVES.categorias, actualizada);
  return actualizada.find((categoria) => categoria.id === Number(id)) || null;
}

export function eliminarCategoria(id) {
  const lista = listarCategorias();
  const actualizada = lista.filter((categoria) => categoria.id !== Number(id));
  guardar(CLAVES.categorias, actualizada);
  return actualizada;
}
