import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Boton from "../../componentes/Boton";
import CampoTexto from "../../componentes/CampoTexto";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { useSesion } from "../../contexto/SesionContexto";
import { correoPermitido, passwordValida } from "../../utilidades/validadores";

export default function Login() {
  const { iniciarSesion } = useSesion();
  const navegar = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  function enviar(evento) {
    evento.preventDefault();

    const nuevos = {};
    if (!correoPermitido(correo)) {
      nuevos.correo = "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";
    }
    if (!passwordValida(password)) {
      nuevos.password = "La contraseña debe tener entre 4 y 10 caracteres.";
    }

    setErrores(nuevos);

    if (Object.keys(nuevos).length > 0) {
      setErrorGeneral("Revisa los datos ingresados antes de continuar.");
      return;
    }

    setErrorGeneral("");
    const sesion = iniciarSesion(correo.trim());
    navegar(sesion.tipoUsuario === "Administrador" ? "/admin" : "/");
  }

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-7 col-lg-5">
          <div className="awsd-card border p-4">
            <span className="section-kicker">Bienvenido de vuelta</span>
            <h1 className="awsd-title h3 mb-4">Iniciar sesión</h1>

            <MensajeAlerta mensaje={errorGeneral} />

            <form onSubmit={enviar} noValidate>
              <CampoTexto
                id="correoLogin"
                etiqueta="Correo"
                tipo="email"
                requerido
                valor={correo}
                error={errores.correo}
                onChange={setCorreo}
              />
              <CampoTexto
                id="passwordLogin"
                etiqueta="Contraseña"
                tipo="password"
                requerido
                valor={password}
                error={errores.password}
                onChange={setPassword}
              />
              <Boton tipo="submit" etiqueta="Ingresar" className="w-100" />
            </form>

            <p className="small text-secondary mt-3 mb-0">
              ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
