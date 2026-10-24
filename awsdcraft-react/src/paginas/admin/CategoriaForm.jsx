import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Boton from "../../componentes/Boton";
import CampoTexto from "../../componentes/CampoTexto";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import {
  actualizarCategoria,
  crearCategoria,
  listarCategorias,
} from "../../servicios/categoriasServicio";
import { textoRequerido } from "../../utilidades/validadores";

const inicial = { nombre: "", slug: "", descripcion: "", imagen: "teclado-87.webp" };

export default function CategoriaForm() {
  const { id } = useParams();
  const navegar = useNavigate();
  const existente = id ? listarCategorias().find((item) => item.id === Number(id)) : null;

  const [formulario, setFormulario] = useState(existente ? { ...existente } : inicial);
  const [errores, setErrores] = useState({});

  function cambiar(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  function validar() {
    const nuevos = {};
    if (!textoRequerido(formulario.nombre, 60)) nuevos.nombre = "Ingresa el nombre.";
    if (!/^[a-z0-9-]+$/.test(formulario.slug)) {
      nuevos.slug = "Usa solo minúsculas, números o guiones.";
    }
    if (!textoRequerido(formulario.descripcion, 200)) {
      nuevos.descripcion = "Ingresa una descripción.";
    }

    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  function enviar(evento) {
    evento.preventDefault();
    if (!validar()) return;

    if (existente) actualizarCategoria(existente.id, formulario);
    else crearCategoria(formulario);

    navegar("/admin/categorias");
  }

  if (id && !existente) {
    return (
      <>
        <MensajeAlerta mensaje="La categoría solicitada no existe." tipo="warning" />
        <Link to="/admin/categorias" className="btn btn-awsd">
          Volver al listado
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="awsd-title h3 mb-4">{existente ? "Editar categoría" : "Nueva categoría"}</h1>

      <form onSubmit={enviar} className="awsd-card border p-4" noValidate>
        <div className="row">
          <div className="col-12 col-md-6">
            <CampoTexto
              id="nombre"
              etiqueta="Nombre"
              requerido
              valor={formulario.nombre}
              error={errores.nombre}
              onChange={(valor) => cambiar("nombre", valor)}
            />
          </div>
          <div className="col-12 col-md-6">
            <CampoTexto
              id="slug"
              etiqueta="Identificador"
              requerido
              marcaAgua="Ej: teclados"
              valor={formulario.slug}
              error={errores.slug}
              onChange={(valor) => cambiar("slug", valor.toLowerCase())}
            />
          </div>
          <div className="col-12">
            <CampoTexto
              id="descripcion"
              etiqueta="Descripción"
              requerido
              valor={formulario.descripcion}
              error={errores.descripcion}
              onChange={(valor) => cambiar("descripcion", valor)}
            />
          </div>
          <div className="col-12">
            <CampoTexto
              id="imagen"
              etiqueta="Archivo de imagen"
              valor={formulario.imagen}
              onChange={(valor) => cambiar("imagen", valor)}
            />
          </div>
        </div>

        <div className="d-flex gap-2">
          <Boton tipo="submit" etiqueta={existente ? "Guardar cambios" : "Crear categoría"} />
          <Link to="/admin/categorias" className="btn btn-outline-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}
