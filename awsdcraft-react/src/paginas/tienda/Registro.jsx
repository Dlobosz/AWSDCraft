import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Boton from "../../componentes/Boton";
import CampoTexto from "../../componentes/CampoTexto";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import SelectorRegionComuna from "../../componentes/SelectorRegionComuna";
import { crearUsuario } from "../../servicios/usuariosServicio";
import {
  correoPermitido,
  passwordValida,
  textoRequerido,
  validarRun,
} from "../../utilidades/validadores";

const inicial = {
  run: "",
  nombre: "",
  apellidos: "",
  correo: "",
  fechaNacimiento: "",
  direccion: "",
  region: "",
  comuna: "",
  password: "",
  confirmarPassword: "",
};

export default function Registro() {
  const navegar = useNavigate();
  const [formulario, setFormulario] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState("");

  function cambiar(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  function validar() {
    const nuevos = {};
    if (!validarRun(formulario.run)) nuevos.run = "RUN inválido, ingrésalo sin puntos ni guion.";
    if (!textoRequerido(formulario.nombre, 50)) nuevos.nombre = "Ingresa tu nombre (máx. 50).";
    if (!textoRequerido(formulario.apellidos, 100)) {
      nuevos.apellidos = "Ingresa tus apellidos (máx. 100).";
    }
    if (!correoPermitido(formulario.correo)) {
      nuevos.correo = "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";
    }
    if (!textoRequerido(formulario.direccion, 300)) nuevos.direccion = "Ingresa tu dirección.";
    if (formulario.region === "") nuevos.region = "Selecciona una región.";
    if (formulario.comuna === "") nuevos.comuna = "Selecciona una comuna.";
    if (!passwordValida(formulario.password)) {
      nuevos.password = "La contraseña debe tener entre 4 y 10 caracteres.";
    }
    if (formulario.confirmarPassword !== formulario.password || formulario.password === "") {
      nuevos.confirmarPassword = "Las contraseñas no coinciden.";
    }

    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  function enviar(evento) {
    evento.preventDefault();
    if (!validar()) {
      setExito("");
      return;
    }

    crearUsuario({
      run: formulario.run.trim().toUpperCase(),
      nombre: formulario.nombre.trim(),
      apellidos: formulario.apellidos.trim(),
      correo: formulario.correo.trim(),
      fechaNacimiento: formulario.fechaNacimiento,
      tipoUsuario: "Cliente",
      region: formulario.region,
      comuna: formulario.comuna,
      direccion: formulario.direccion.trim(),
    });

    setExito("Cuenta creada correctamente. Te llevaremos al inicio de sesión.");
    setFormulario(inicial);
    setTimeout(() => navegar("/login"), 1800);
  }

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="awsd-card border p-4">
            <span className="section-kicker">Crea tu cuenta</span>
            <h1 className="awsd-title h3 mb-4">Registro de usuario</h1>

            <MensajeAlerta mensaje={exito} tipo="success" />

            <form onSubmit={enviar} noValidate>
              <div className="row">
                <div className="col-12 col-md-6">
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
                <div className="col-12 col-md-6">
                  <CampoTexto
                    id="fechaNacimiento"
                    etiqueta="Fecha de nacimiento"
                    tipo="date"
                    valor={formulario.fechaNacimiento}
                    onChange={(valor) => cambiar("fechaNacimiento", valor)}
                  />
                </div>
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
                    id="apellidos"
                    etiqueta="Apellidos"
                    requerido
                    valor={formulario.apellidos}
                    error={errores.apellidos}
                    onChange={(valor) => cambiar("apellidos", valor)}
                  />
                </div>
                <div className="col-12">
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

              <div className="row mt-3">
                <div className="col-12 col-md-6">
                  <CampoTexto
                    id="password"
                    etiqueta="Contraseña"
                    tipo="password"
                    requerido
                    valor={formulario.password}
                    error={errores.password}
                    onChange={(valor) => cambiar("password", valor)}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <CampoTexto
                    id="confirmarPassword"
                    etiqueta="Confirmar contraseña"
                    tipo="password"
                    requerido
                    valor={formulario.confirmarPassword}
                    error={errores.confirmarPassword}
                    onChange={(valor) => cambiar("confirmarPassword", valor)}
                  />
                </div>
              </div>

              <Boton tipo="submit" etiqueta="Crear cuenta" className="w-100 mt-2" />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
