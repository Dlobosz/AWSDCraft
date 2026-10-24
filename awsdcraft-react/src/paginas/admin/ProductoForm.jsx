import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Boton from "../../componentes/Boton";
import CampoTexto from "../../componentes/CampoTexto";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { listarCategorias } from "../../servicios/categoriasServicio";
import {
  actualizarProducto,
  crearProducto,
  obtenerProducto,
} from "../../servicios/productosServicio";
import { textoRequerido } from "../../utilidades/validadores";

const inicial = {
  codigo: "",
  nombre: "",
  categoria: "teclados",
  precio: "",
  stock: "",
  stockCritico: "",
  switch: "",
  descripcion: "",
  imagen: "teclado-87.webp",
  destacado: false,
  descuento: 0,
};

export default function ProductoForm() {
  const { id } = useParams();
  const navegar = useNavigate();
  const categorias = listarCategorias();
  const existente = id ? obtenerProducto(id) : null;

  const [formulario, setFormulario] = useState(existente ? { ...existente } : inicial);
  const [errores, setErrores] = useState({});

  function cambiar(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  function validar() {
    const nuevos = {};
    if (!textoRequerido(formulario.codigo, 20)) nuevos.codigo = "Ingresa el código del producto.";
    if (!textoRequerido(formulario.nombre, 100)) nuevos.nombre = "Ingresa el nombre.";
    if (Number(formulario.precio) <= 0) nuevos.precio = "El precio debe ser mayor a 0.";
    if (Number(formulario.stock) < 0 || formulario.stock === "") {
      nuevos.stock = "Ingresa un stock válido.";
    }
    if (Number(formulario.stockCritico) < 0 || formulario.stockCritico === "") {
      nuevos.stockCritico = "Ingresa el stock crítico.";
    }
    if (!textoRequerido(formulario.descripcion, 500)) {
      nuevos.descripcion = "Ingresa una descripción.";
    }

    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  function enviar(evento) {
    evento.preventDefault();
    if (!validar()) return;

    const datos = {
      ...formulario,
      precio: Number(formulario.precio),
      stock: Number(formulario.stock),
      stockCritico: Number(formulario.stockCritico),
      descuento: Number(formulario.descuento),
    };

    if (existente) actualizarProducto(existente.id, datos);
    else crearProducto(datos);

    navegar("/admin/productos");
  }

  if (id && !existente) {
    return (
      <>
        <MensajeAlerta mensaje="El producto solicitado no existe." tipo="warning" />
        <Link to="/admin/productos" className="btn btn-awsd">
          Volver al listado
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="awsd-title h3 mb-4">{existente ? "Editar producto" : "Nuevo producto"}</h1>

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
              <label className="form-label" htmlFor="categoria">
                Categoría
              </label>
              <select
                id="categoria"
                className="form-select"
                value={formulario.categoria}
                onChange={(evento) => cambiar("categoria", evento.target.value)}
              >
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.slug}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
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
              id="switch"
              etiqueta="Switch"
              valor={formulario.switch}
              onChange={(valor) => cambiar("switch", valor)}
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
          <Boton tipo="submit" etiqueta={existente ? "Guardar cambios" : "Crear producto"} />
          <Link to="/admin/productos" className="btn btn-outline-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}
