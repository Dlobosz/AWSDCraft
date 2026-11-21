import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Boton from "../../componentes/Boton";
import CampoTexto from "../../componentes/CampoTexto";
import EstadoCarga from "../../componentes/EstadoCarga";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { useCarga } from "../../hooks/useCarga";
import { erroresDeCampo, mensajeError } from "../../servicios/api";
import { listarCategorias } from "../../servicios/categoriasServicio";
import {
  actualizarProducto,
  crearProducto,
  obtenerProducto,
} from "../../servicios/productosServicio";
import { textoRequerido } from "../../utilidades/validadores";

const vacio = {
  codigo: "",
  nombre: "",
  categoriaId: "",
  precio: "",
  stock: "",
  stockCritico: "",
  tipoSwitch: "",
  descripcion: "",
  imagen: "teclado-87.webp",
  destacado: false,
  descuento: 0,
};

/** Carga las categorías (y el producto si se edita) antes de mostrar el formulario. */
export default function ProductoForm() {
  const { id } = useParams();
  const { datos, cargando, error } = useCarga(
    () => Promise.all([listarCategorias(), id ? obtenerProducto(id) : Promise.resolve(null)]),
    [id]
  );

  if (cargando || error) {
    return (
      <>
        <EstadoCarga cargando={cargando} error={error} />
        {error && (
          <Link to="/admin/productos" className="btn btn-awsd">
            Volver al listado
          </Link>
        )}
      </>
    );
  }

  const [categorias, existente] = datos;
  const inicial = existente
    ? { ...vacio, ...existente, tipoSwitch: existente.tipoSwitch ?? "", descripcion: existente.descripcion ?? "" }
    : { ...vacio, categoriaId: categorias[0]?.id ?? "" };

  return <FormularioProducto existente={existente} inicial={inicial} categorias={categorias} />;
}

function FormularioProducto({ existente, inicial, categorias }) {
  const navegar = useNavigate();
  const [formulario, setFormulario] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  function cambiar(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  function validar() {
    const nuevos = {};
    if (!textoRequerido(formulario.codigo, 20)) nuevos.codigo = "Ingresa el código del producto.";
    if (!textoRequerido(formulario.nombre, 100)) nuevos.nombre = "Ingresa el nombre.";
    if (!formulario.categoriaId) nuevos.categoriaId = "Selecciona una categoría.";
    if (Number(formulario.precio) <= 0) nuevos.precio = "El precio debe ser mayor a 0.";
    if (Number(formulario.stock) < 0 || formulario.stock === "") {
      nuevos.stock = "Ingresa un stock válido.";
    }
    if (Number(formulario.stockCritico) < 0 || formulario.stockCritico === "") {
      nuevos.stockCritico = "Ingresa el stock crítico.";
    }
    if (Number(formulario.descuento) < 0 || Number(formulario.descuento) > 90) {
      nuevos.descuento = "El descuento debe estar entre 0 y 90.";
    }
    if (!textoRequerido(formulario.descripcion, 500)) {
      nuevos.descripcion = "Ingresa una descripción.";
    }

    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  async function enviar(evento) {
    evento.preventDefault();
    setErrorGeneral("");
    if (!validar()) return;

    const datos = {
      codigo: formulario.codigo.trim(),
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion.trim(),
      precio: Number(formulario.precio),
      stock: Number(formulario.stock),
      stockCritico: Number(formulario.stockCritico),
      tipoSwitch: formulario.tipoSwitch.trim(),
      imagen: formulario.imagen.trim(),
      destacado: formulario.destacado,
      descuento: Number(formulario.descuento) || 0,
      categoriaId: Number(formulario.categoriaId),
    };

    setEnviando(true);
    try {
      if (existente) await actualizarProducto(existente.id, datos); // PUT
      else await crearProducto(datos); // POST
      navegar("/admin/productos", {
        state: { aviso: `Producto "${datos.nombre}" ${existente ? "actualizado" : "creado"} correctamente.` },
      });
    } catch (error) {
      setErrores(erroresDeCampo(error));
      setErrorGeneral(mensajeError(error, "No se pudo guardar el producto.")); // p. ej. código duplicado (409)
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <h1 className="awsd-title h3 mb-4">{existente ? "Editar producto" : "Nuevo producto"}</h1>

      <MensajeAlerta mensaje={errorGeneral} />

      <form onSubmit={enviar} className="awsd-card border p-4" noValidate>
        <div className="row">
          <div className="col-12 col-md-4">
            <CampoTexto
              id="codigo"
              etiqueta="Código"
              requerido
              valor={formulario.codigo}
              error={errores.codigo}
              onChange={(valor) => cambiar("codigo", valor)}
            />
          </div>
          <div className="col-12 col-md-8">
            <CampoTexto
              id="nombre"
              etiqueta="Nombre"
              requerido
              valor={formulario.nombre}
              error={errores.nombre}
              onChange={(valor) => cambiar("nombre", valor)}
            />
          </div>

          <div className="col-12 col-md-4">
            <div className="mb-3">
              <label className="form-label" htmlFor="categoriaId">
                Categoría<span className="text-danger">*</span>
              </label>
              <select
                id="categoriaId"
                className={`form-select ${errores.categoriaId ? "is-invalid-awsd" : ""}`}
                value={formulario.categoriaId}
                onChange={(evento) => cambiar("categoriaId", evento.target.value)}
              >
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              {errores.categoriaId && (
                <div className="invalid-feedback-awsd d-block">{errores.categoriaId}</div>
              )}
            </div>
          </div>
          <div className="col-12 col-md-4">
            <CampoTexto
              id="precio"
              etiqueta="Precio"
              tipo="number"
              requerido
              valor={formulario.precio}
              error={errores.precio}
              onChange={(valor) => cambiar("precio", valor)}
            />
          </div>
          <div className="col-12 col-md-4">
            <CampoTexto
              id="descuento"
              etiqueta="Descuento (%)"
              tipo="number"
              valor={formulario.descuento}
              error={errores.descuento}
              onChange={(valor) => cambiar("descuento", valor)}
            />
          </div>

          <div className="col-12 col-md-4">
            <CampoTexto
              id="stock"
              etiqueta="Stock"
              tipo="number"
              requerido
              valor={formulario.stock}
              error={errores.stock}
              onChange={(valor) => cambiar("stock", valor)}
            />
          </div>
          <div className="col-12 col-md-4">
            <CampoTexto
              id="stockCritico"
              etiqueta="Stock crítico"
              tipo="number"
              requerido
              valor={formulario.stockCritico}
              error={errores.stockCritico}
              onChange={(valor) => cambiar("stockCritico", valor)}
            />
          </div>
          <div className="col-12 col-md-4">
            <CampoTexto
              id="tipoSwitch"
              etiqueta="Switch"
              valor={formulario.tipoSwitch}
              onChange={(valor) => cambiar("tipoSwitch", valor)}
            />
          </div>

          <div className="col-12">
            <CampoTexto
              id="imagen"
              etiqueta="Archivo de imagen"
              marcaAgua="Ej: teclado-87.webp"
              valor={formulario.imagen}
              onChange={(valor) => cambiar("imagen", valor)}
            />
          </div>

          <div className="col-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="descripcion">
                Descripción<span className="text-danger">*</span>
              </label>
              <textarea
                id="descripcion"
                rows="3"
                className={`form-control ${errores.descripcion ? "is-invalid-awsd" : ""}`}
                value={formulario.descripcion}
                onChange={(evento) => cambiar("descripcion", evento.target.value)}
              ></textarea>
              {errores.descripcion && (
                <div className="invalid-feedback-awsd d-block">{errores.descripcion}</div>
              )}
            </div>
          </div>

          <div className="col-12">
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="destacado"
                checked={formulario.destacado}
                onChange={(evento) => cambiar("destacado", evento.target.checked)}
              />
              <label className="form-check-label" htmlFor="destacado">
                Mostrar en productos destacados
              </label>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2">
          <Boton
            tipo="submit"
            deshabilitado={enviando}
            etiqueta={enviando ? "Guardando..." : existente ? "Guardar cambios" : "Crear producto"}
          />
          <Link to="/admin/productos" className="btn btn-outline-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}
