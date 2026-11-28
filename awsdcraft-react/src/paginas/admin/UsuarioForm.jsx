import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Boton from "../../componentes/Boton";
import CampoTexto from "../../componentes/CampoTexto";
import EstadoCarga from "../../componentes/EstadoCarga";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import SelectorRegionComuna from "../../componentes/SelectorRegionComuna";
import { useCarga } from "../../hooks/useCarga";
import { erroresDeCampo, mensajeError } from "../../servicios/api";
import { actualizarUsuario, crearUsuario, obtenerUsuario } from "../../servicios/usuariosServicio";
import { ETIQUETAS_ROL, ROLES } from "../../utilidades/permisos";
import {
  correoPermitido,
  direccionValida,
  nombreValido,
  passwordValida,
  validarRun,
} from "../../utilidades/validadores";

const vacio = {
  run: "",
  nombre: "",
  apellidos: "",
  correo: "",
  password: "",
  fechaNacimiento: "",
  rol: ROLES.CLIENTE,
  region: "",
  comuna: "",
  direccion: "",
};

export default function UsuarioForm() {
  const { id } = useParams();
  const { datos: existente, cargando, error } = useCarga(
    () => (id ? obtenerUsuario(id) : Promise.resolve(null)),
    [id]
  );

  if (cargando || error) {
    return (
      <>
        <EstadoCarga cargando={cargando} error={error} />
        {error && (
          <Link to="/admin/usuarios" className="btn btn-awsd">
            Volver al listado
          </Link>
        )}
      </>
    );
  }

  const inicial = existente
    ? {
        ...vacio,
        run: existente.run,
        nombre: existente.nombre,
        apellidos: existente.apellidos,
        correo: existente.correo,
        fechaNacimiento: existente.fechaNacimiento ?? "",
        rol: existente.rol,
        region: existente.region ?? "",
        comuna: existente.comuna ?? "",
        direccion: existente.direccion ?? "",
      }
    : vacio;

  return <FormularioUsuario existente={existente} inicial={inicial} />;
}

function FormularioUsuario({ existente, inicial }) {
  const navegar = useNavigate();
  const [formulario, setFormulario] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  function cambiar(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  function validar() {
    const nuevos = {};
    if (!validarRun(formulario.run)) nuevos.run = "RUN inválido, sin puntos ni guion.";
    if (!nombreValido(formulario.nombre, 50)) nuevos.nombre = "Ingresa el nombre: al menos 2 letras, sin números.";
    if (!nombreValido(formulario.apellidos, 100)) {
      nuevos.apellidos = "Ingresa los apellidos: al menos 2 letras, sin números.";
    }
    if (!correoPermitido(formulario.correo)) {
      nuevos.correo = "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com, con al menos 3 caracteres antes de la @.";
    }
    // Al crear, la contraseña es obligatoria; al editar, vacía significa "no cambiarla".
    if ((!existente || formulario.password !== "") && !passwordValida(formulario.password)) {
      nuevos.password = "La contraseña debe tener entre 4 y 10 caracteres.";
    }
    if (formulario.region === "") nuevos.region = "Selecciona una región.";
    if (formulario.comuna === "") nuevos.comuna = "Selecciona una comuna.";
    if (!direccionValida(formulario.direccion)) {
      nuevos.direccion = "Ingresa la dirección con número (mínimo 5 caracteres).";
    }

    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  async function enviar(evento) {
    evento.preventDefault();
    setErrorGeneral("");
    if (!validar()) return;

    const datos = {
      run: formulario.run.trim().toUpperCase(),
      nombre: formulario.nombre.trim(),
      apellidos: formulario.apellidos.trim(),
      correo: formulario.correo.trim(),
      password: formulario.password || null,
      fechaNacimiento: formulario.fechaNacimiento || null,
      rol: formulario.rol,
      region: formulario.region,
      comuna: formulario.comuna,
      direccion: formulario.direccion.trim(),
    };

    try {
      if (existente) await actualizarUsuario(existente.id, datos);
      else await crearUsuario(datos);
      navegar("/admin/usuarios", {
        state: { aviso: `Usuario ${datos.correo} guardado correctamente.` },
      });
    } catch (error) {
      setErrores(erroresDeCampo(error));
      setErrorGeneral(mensajeError(error, "No se pudo guardar el usuario."));
    }
  }

  return (
    <>
      <h1 className="awsd-title h3 mb-4">{existente ? "Editar usuario" : "Nuevo usuario"}</h1>

      <MensajeAlerta mensaje={errorGeneral} />

      <form onSubmit={enviar} className="awsd-card border p-4" noValidate>
        <div className="row">
          <div className="col-12 col-md-4">
            <CampoTexto
              id="run"
              etiqueta="RUN"
              requerido
              marcaAgua="Ej: 190110222"
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
              error={errores.fechaNacimiento}
              onChange={(valor) => cambiar("fechaNacimiento", valor)}
            />
          </div>
          <div className="col-12 col-md-3">
            <div className="mb-3">
              <label className="form-label" htmlFor="rol">
                Rol
              </label>
              <select
                id="rol"
                className="form-select"
                value={formulario.rol}
                onChange={(evento) => cambiar("rol", evento.target.value)}
              >
                {Object.values(ROLES).map((rol) => (
                  <option key={rol} value={rol}>
                    {ETIQUETAS_ROL[rol]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <CampoTexto
              id="password"
              etiqueta={existente ? "Nueva contraseña (opcional)" : "Contraseña"}
              tipo="password"
              requerido={!existente}
              marcaAgua={existente ? "Déjala vacía para conservar la actual" : "Entre 4 y 10 caracteres"}
              valor={formulario.password}
              error={errores.password}
              onChange={(valor) => cambiar("password", valor)}
            />
          </div>

          <div className="col-12 col-md-6">
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
