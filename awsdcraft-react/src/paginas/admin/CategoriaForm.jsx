import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Boton from "../../componentes/Boton";
import CampoTexto from "../../componentes/CampoTexto";
import EstadoCarga from "../../componentes/EstadoCarga";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { useCarga } from "../../hooks/useCarga";
import { erroresDeCampo, mensajeError } from "../../servicios/api";
import {
  actualizarCategoria,
  crearCategoria,
  obtenerCategoria,
} from "../../servicios/categoriasServicio";
import { textoRequerido } from "../../utilidades/validadores";

const vacio = { nombre: "", slug: "", descripcion: "", imagen: "teclado-87.webp" };

export default function CategoriaForm() {
  const { id } = useParams();
  const { datos: existente, cargando, error } = useCarga(
    () => (id ? obtenerCategoria(id) : Promise.resolve(null)),
    [id]
  );

  if (cargando || error) {
    return (
      <>
        <EstadoCarga cargando={cargando} error={error} />
        {error && (
          <Link to="/admin/categorias" className="btn btn-awsd">
            Volver al listado
          </Link>
        )}
      </>
    );
  }

  const inicial = existente
    ? {
        nombre: existente.nombre,
        slug: existente.slug,
        descripcion: existente.descripcion ?? "",
        imagen: existente.imagen ?? "",
      }
    : vacio;

  return <FormularioCategoria existente={existente} inicial={inicial} />;
}

function FormularioCategoria({ existente, inicial }) {
  const navegar = useNavigate();
  const [formulario, setFormulario] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  function cambiar(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  function validar() {
    const nuevos = {};
    if (!textoRequerido(formulario.nombre, 60, 3)) nuevos.nombre = "Ingresa el nombre: entre 3 y 60 caracteres.";
    if (formulario.slug && !/^[a-z0-9-]+$/.test(formulario.slug)) {
      nuevos.slug = "Usa solo minúsculas, números o guiones (o déjalo vacío para generarlo).";
    }
    if (!textoRequerido(formulario.descripcion, 255, 10)) {
      nuevos.descripcion = "Ingresa una descripción: entre 10 y 255 caracteres.";
    }

    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  async function enviar(evento) {
    evento.preventDefault();
    setErrorGeneral("");
    if (!validar()) return;

    try {
      if (existente) await actualizarCategoria(existente.id, formulario);
      else await crearCategoria(formulario);
      navegar("/admin/categorias", {
        state: { aviso: `Categoría "${formulario.nombre}" guardada correctamente.` },
      });
    } catch (error) {
      setErrores(erroresDeCampo(error));
      setErrorGeneral(mensajeError(error, "No se pudo guardar la categoría."));
    }
  }

  return (
    <>
      <h1 className="awsd-title h3 mb-4">{existente ? "Editar categoría" : "Nueva categoría"}</h1>

      <MensajeAlerta mensaje={errorGeneral} />

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
              etiqueta="Identificador (opcional)"
              marcaAgua="Ej: teclados (se genera desde el nombre)"
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
