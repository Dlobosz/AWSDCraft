import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Boton from "../../componentes/Boton";
import CampoTexto from "../../componentes/CampoTexto";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { useSesion } from "../../contexto/SesionContexto";
import { mensajeError } from "../../servicios/api";
import { rutaInicial } from "../../utilidades/permisos";
import { correoPermitido } from "../../utilidades/validadores";

export default function Login() {
  const { iniciarSesion, avisoSesion, limpiarAviso } = useSesion();
  const navegar = useNavigate();
  const ubicacion = useLocation();

  // Si el usuario llegó aquí desde una ruta protegida, se recuerda para volver después del login.
  const desde = ubicacion.state?.desde;
  const motivo = ubicacion.state?.motivo || avisoSesion;

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();

    const nuevos = {};
    if (!correoPermitido(correo)) {
      nuevos.correo = "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";
    }
    if (password.trim() === "") nuevos.password = "Ingresa tu contraseña.";
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) {
      setErrorGeneral("Revisa los datos ingresados antes de continuar.");
      return;
    }

    setErrorGeneral("");
    setEnviando(true);
    try {
      // POST /api/v1/auth/login -> el backend valida la contraseña (BCrypt) y entrega los tokens.
      const usuario = await iniciarSesion(correo.trim(), password);
      limpiarAviso();
      navegar(desde && desde !== "/login" ? desde : rutaInicial(usuario), { replace: true });
    } catch (error) {
      setErrorGeneral(mensajeError(error, "No se pudo iniciar sesión."));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-7 col-lg-5">
          <div className="awsd-card border p-4">
            <span className="section-kicker">Bienvenido de vuelta</span>
            <h1 className="awsd-title h3 mb-4">Iniciar sesión</h1>

            <MensajeAlerta mensaje={motivo} tipo="warning" />
            <MensajeAlerta mensaje={errorGeneral} />

            <form onSubmit={enviar} noValidate>
              <CampoTexto
                id="correoLogin"
                autoCompletar="email"
                marcaAgua="nombre@duoc.cl"
                etiqueta="Correo"
                tipo="email"
                requerido
                valor={correo}
                error={errores.correo}
                onChange={setCorreo}
              />
              <CampoTexto
                id="passwordLogin"
                autoCompletar="current-password"
                etiqueta="Contraseña"
                tipo="password"
                requerido
                valor={password}
                error={errores.password}
                onChange={setPassword}
              />
              <Boton
                tipo="submit"
                etiqueta={enviando ? "Ingresando..." : "Ingresar"}
                deshabilitado={enviando}
                className="w-100"
              />
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
