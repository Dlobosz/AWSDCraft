import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Boton from "../../componentes/Boton";
import CampoTexto from "../../componentes/CampoTexto";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import SelectorRegionComuna from "../../componentes/SelectorRegionComuna";
import TablaCarrito from "../../componentes/TablaCarrito";
import { useCarrito } from "../../contexto/CarritoContexto";
import { useSesion } from "../../contexto/SesionContexto";
import { crearOrden } from "../../servicios/ordenesServicio";
import { descontarStock } from "../../servicios/productosServicio";
import { formatearPrecio } from "../../utilidades/formato";
import { correoPermitido, textoRequerido } from "../../utilidades/validadores";

export default function Checkout() {
  const { items, total, vaciar } = useCarrito();
  const { usuario } = useSesion();
  const navegar = useNavigate();

  const [formulario, setFormulario] = useState({
    nombre: usuario ? usuario.nombre : "",
    apellidos: usuario ? usuario.apellidos : "",
    correo: usuario ? usuario.correo : "",
    calle: usuario ? usuario.direccion : "",
    departamento: "",
    region: usuario ? usuario.region : "",
    comuna: usuario ? usuario.comuna : "",
    indicaciones: "",
    metodoPago: "credito",
  });
  const [errores, setErrores] = useState({});

  if (items.length === 0) return <Navigate to="/carrito" replace />;

  function cambiar(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  function validar() {
    const nuevos = {};
    if (!textoRequerido(formulario.nombre, 50)) nuevos.nombre = "Ingresa tu nombre.";
    if (!textoRequerido(formulario.apellidos, 100)) nuevos.apellidos = "Ingresa tus apellidos.";
    if (!correoPermitido(formulario.correo)) {
      nuevos.correo = "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";
    }
    if (!textoRequerido(formulario.calle, 300)) nuevos.calle = "Ingresa la dirección de entrega.";
    if (formulario.region === "") nuevos.region = "Selecciona una región.";
    if (formulario.comuna === "") nuevos.comuna = "Selecciona una comuna.";

    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  function pagar(evento) {
    evento.preventDefault();
    if (!validar()) return;

    const pagoAprobado = formulario.metodoPago !== "rechazada";

    const orden = crearOrden({
      ...formulario,
      items,
      total,
      estado: pagoAprobado ? "Pagada" : "Rechazada",
    });

    if (pagoAprobado) {
      descontarStock(items);
      vaciar();
      navegar(`/pago-exitoso/${orden.id}`);
    } else {
      navegar(`/pago-error/${orden.id}`);
    }
  }

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9">
          <div className="awsd-card border p-3 p-md-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
              <div>
                <h1 className="awsd-title h3 mb-1">Carrito de compra</h1>
                <p className="text-secondary small mb-0">Completa la siguiente información</p>
              </div>
              <span className="btn btn-awsd">Total a pagar: {formatearPrecio(total)}</span>
            </div>

            <TablaCarrito items={items} editable={false} />

            <form onSubmit={pagar} className="mt-4" noValidate>
              <h2 className="h5 awsd-title">Información del cliente</h2>
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
              </div>

              <h2 className="h5 awsd-title mt-3">Dirección de entrega</h2>
              <div className="row">
                <div className="col-12 col-md-8">
                  <CampoTexto
                    id="calle"
                    etiqueta="Calle"
                    requerido
                    valor={formulario.calle}
                    error={errores.calle}
                    onChange={(valor) => cambiar("calle", valor)}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <CampoTexto
                    id="departamento"
                    etiqueta="Departamento (opcional)"
                    marcaAgua="Ej: 603"
                    valor={formulario.departamento}
                    onChange={(valor) => cambiar("departamento", valor)}
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

              <div className="mt-3">
                <label className="form-label" htmlFor="indicaciones">
                  Indicaciones para la entrega (opcional)
                </label>
                <textarea
                  id="indicaciones"
                  className="form-control"
                  rows="3"
                  placeholder="Ej: entre calles, color del edificio, no tiene timbre."
                  value={formulario.indicaciones}
                  onChange={(evento) => cambiar("indicaciones", evento.target.value)}
                ></textarea>
              </div>

              <div className="mt-3">
                <label className="form-label" htmlFor="metodoPago">
                  Método de pago
                </label>
                <select
                  id="metodoPago"
                  className="form-select"
                  value={formulario.metodoPago}
                  onChange={(evento) => cambiar("metodoPago", evento.target.value)}
                >
                  <option value="credito">Tarjeta de crédito</option>
                  <option value="debito">Tarjeta de débito</option>
                  <option value="rechazada">Tarjeta de prueba (rechazada)</option>
                </select>
              </div>

              {Object.keys(errores).length > 0 && (
                <div className="mt-3">
                  <MensajeAlerta mensaje="Revisa los campos marcados antes de continuar." />
                </div>
              )}

              <div className="d-flex justify-content-end mt-4">
                <Boton tipo="submit" etiqueta={`Pagar ahora ${formatearPrecio(total)}`} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
