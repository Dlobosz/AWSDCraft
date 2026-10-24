import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Boton from "../../componentes/Boton";
import CampoTexto from "../../componentes/CampoTexto";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import SelectorRegionComuna from "../../componentes/SelectorRegionComuna";
import { tiposUsuario } from "../../datos/categorias";
import { actualizarUsuario, crearUsuario, obtenerUsuario } from "../../servicios/usuariosServicio";
import { correoPermitido, textoRequerido, validarRun } from "../../utilidades/validadores";

const inicial = {
  run: "",
  nombre: "",
  apellidos: "",
  correo: "",
  fechaNacimiento: "",
  tipoUsuario: "Cliente",
  region: "",
  comuna: "",
  direccion: "",
};

export default function UsuarioForm() {
  const { id } = useParams();
  const navegar = useNavigate();
  const existente = id ? obtenerUsuario(id) : null;

  const [formulario, setFormulario] = useState(existente ? { ...existente } : inicial);
  const [errores, setErrores] = useState({});

  function cambiar(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  function validar() {
    const nuevos = {};
    if (!validarRun(formulario.run)) nuevos.run = "RUN inválido, sin puntos ni guion.";
    if (!textoRequerido(formulario.nombre, 50)) nuevos.nombre = "Ingresa el nombre (máx. 50).";
    if (!textoRequerido(formulario.apellidos, 100)) {
      nuevos.apellidos = "Ingresa los apellidos (máx. 100).";
    }
    if (!correoPermitido(formulario.correo)) {
      nuevos.correo = "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";
    }
    if (formulario.region === "") nuevos.region = "Selecciona una región.";
    if (formulario.comuna === "") nuevos.comuna = "Selecciona una comuna.";
    if (!textoRequerido(formulario.direccion, 300)) nuevos.direccion = "Ingresa la dirección.";

    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  function enviar(evento) {
    evento.preventDefault();
    if (!validar()) return;

    if (existente) actualizarUsuario(existente.id, formulario);
    else crearUsuario(formulario);

    navegar("/admin/usuarios");
  }

  if (id && !existente) {
    return (
      <>
        <MensajeAlerta mensaje="El usuario solicitado no existe." tipo="warning" />
        <Link to="/admin/usuarios" className="btn btn-awsd">
          Volver al listado
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="awsd-title h3 mb-4">{existente ? "Editar usuario" : "Nuevo usuario"}</h1>

      <form onSubmit={enviar} className="awsd-card border p-4" noValidate>
        <div className="row">
          <div className="col-12 col-md-4">
            <CampoTexto
              id="run"
              etiqueta="RUN"
              requerido
              marcaAgua="Ej: 190110229"
              valor={formulario.run}
              error={errores.run}
              onChange={(valor) => cambiar("run", valor)}
            />
          </div>
          <div className="col-12 col-md-4">
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
            <CampoTexto
              id="apellidos"
              etiqueta="Apellidos"
              requerido
              valor={formulario.apellidos}
              error={errores.apellidos}
              onChange={(valor) => cambiar("apellidos", valor)}
            />
          </div>

          <div className="col-12 col-md-6">
            <CampoTexto
              id="correo"
              etiqueta="Correo"
              tipo="email"
              requerido
              valor={formulario.correo}
              error={errores.correo}
              onChange={(valor) => cambiar("correo", valor)}
            />
          </div>
          <div className="col-12 col-md-3">
            <CampoTexto
              id="fechaNacimiento"
              etiqueta="Fecha de nacimiento"
              tipo="date"
              valor={formulario.fechaNacimiento}
              onChange={(valor) => cambiar("fechaNacimiento", valor)}
            />
          </div>
          <div className="col-12 col-md-3">
            <div className="mb-3">
              <label className="form-label" htmlFor="tipoUsuario">
                Tipo de usuario
              </label>
              <select
                id="tipoUsuario"
                className="form-select"
                value={formulario.tipoUsuario}
                onChange={(evento) => cambiar("tipoUsuario", evento.target.value)}
              >
                {tiposUsuario.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-12">
            <CampoTexto
              id="direccion"
              etiqueta="Dirección"
              requerido
              valor={formulario.direccion}
              error={errores.direccion}
              onChange={(valor) => cambiar("direccion", valor)}
            />
          </div>
        </div>

        <SelectorRegionComuna
          region={formulario.region}
          comuna={formulario.comuna}
          errores={errores}
          onCambiarRegion={(valor) => cambiar("region", valor)}
          onCambiarComuna={(valor) => cambiar("comuna", valor)}
        />

        <div className="d-flex gap-2 mt-4">
          <Boton tipo="submit" etiqueta={existente ? "Guardar cambios" : "Crear usuario"} />
          <Link to="/admin/usuarios" className="btn btn-outline-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}
