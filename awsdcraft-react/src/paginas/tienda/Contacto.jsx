import { useState } from "react";
import Boton from "../../componentes/Boton";
import CampoTexto from "../../componentes/CampoTexto";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { correoPermitido, textoRequerido } from "../../utilidades/validadores";

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [comentario, setComentario] = useState("");
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState("");

  function enviar(evento) {
    evento.preventDefault();

    const nuevos = {};
    if (!textoRequerido(nombre, 100)) nuevos.nombre = "Ingresa tu nombre (máx. 100).";
    if (correo.trim() !== "" && !correoPermitido(correo)) {
      nuevos.correo = "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";
    }
    if (!textoRequerido(comentario, 500)) {
      nuevos.comentario = "Escribe tu comentario (máx. 500 caracteres).";
    }

    setErrores(nuevos);

    if (Object.keys(nuevos).length > 0) {
      setExito("");
      return;
    }

    setExito("Gracias por escribirnos, te responderemos pronto.");
    setNombre("");
    setCorreo("");
    setComentario("");
  }

  return (
    <section className="container py-5">
      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <span className="section-kicker">Hablemos</span>
          <h1 className="awsd-title mb-3">Contacto</h1>
          <p className="text-secondary">
            Escríbenos si tienes dudas sobre compatibilidad de switches, kits o despachos.
          </p>

          <ul className="list-unstyled text-secondary small">
            <li className="mb-2">
              <i className="bi bi-envelope me-2"></i>contacto@awsdcraft.cl
            </li>
            <li className="mb-2">
              <i className="bi bi-telephone me-2"></i>+56 9 1234 5678
            </li>
            <li>
              <i className="bi bi-geo-alt me-2"></i>Santiago, Región Metropolitana
            </li>
          </ul>
        </div>

        <div className="col-12 col-lg-7">
          <div className="awsd-card border p-4">
            <MensajeAlerta mensaje={exito} tipo="success" />

            <form onSubmit={enviar} noValidate>
              <CampoTexto
                id="nombreContacto"
                etiqueta="Nombre"
                requerido
                valor={nombre}
                error={errores.nombre}
                onChange={setNombre}
              />
              <CampoTexto
                id="correoContacto"
                etiqueta="Correo (opcional)"
                tipo="email"
                valor={correo}
                error={errores.correo}
                onChange={setCorreo}
              />

              <div className="mb-3">
                <label className="form-label" htmlFor="comentarioContacto">
                  Comentario<span className="text-danger">*</span>
                </label>
                <textarea
                  id="comentarioContacto"
                  className={`form-control ${errores.comentario ? "is-invalid-awsd" : ""}`}
                  rows="4"
                  maxLength="500"
                  value={comentario}
                  onChange={(evento) => setComentario(evento.target.value)}
                ></textarea>
                <div className="d-flex justify-content-between">
                  {errores.comentario && (
                    <span className="invalid-feedback-awsd d-block">{errores.comentario}</span>
                  )}
                  <span className="small text-secondary ms-auto">{comentario.length} / 500</span>
                </div>
              </div>

              <Boton tipo="submit" etiqueta="Enviar comentario" />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
