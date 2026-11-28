import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Boton from "../../componentes/Boton";
import CampoTexto from "../../componentes/CampoTexto";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import SelectorRegionComuna from "../../componentes/SelectorRegionComuna";
import TablaCarrito from "../../componentes/TablaCarrito";
import { useCarrito } from "../../contexto/CarritoContexto";
import { useSesion } from "../../contexto/SesionContexto";
import { erroresDeCampo, mensajeError } from "../../servicios/api";
import { crearOrden } from "../../servicios/ordenesServicio";
import { formatearPrecio } from "../../utilidades/formato";
import {
  correoPermitido,
  direccionValida,
  nombreValido,
  numeroOpcionalValido,
} from "../../utilidades/validadores";

export default function Checkout() {
  const { items, total, vaciar } = useCarrito();
  const { usuario } = useSesion();
  const navegar = useNavigate();

  // Si hay sesión iniciada, el formulario se completa con los datos del perfil.
  const [formulario, setFormulario] = useState({
    nombre: usuario?.nombre ?? "",
    apellidos: usuario?.apellidos ?? "",
    correo: usuario?.correo ?? "",
    calle: usuario?.direccion ?? "",
    departamento: "",
    region: usuario?.region ?? "",
    comuna: usuario?.comuna ?? "",
    indicaciones: "",
    metodoPago: "credito",
  });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (items.length === 0) return <Navigate to="/carrito" replace />;

  function cambiar(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  function validar() {
    const nuevos = {};
    if (!nombreValido(formulario.nombre, 50)) nuevos.nombre = "Ingresa tu nombre: al menos 2 letras, sin números.";
    if (!nombreValido(formulario.apellidos, 100)) {
      nuevos.apellidos = "Ingresa tus apellidos: al menos 2 letras, sin números.";
    }
    if (!correoPermitido(formulario.correo)) {
      nuevos.correo = "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com, con al menos 3 caracteres antes de la @.";
    }
    if (!direccionValida(formulario.calle)) {
      nuevos.calle = "Ingresa la calle y el número (mínimo 5 caracteres).";
    }
    if (!numeroOpcionalValido(formulario.departamento)) {
      nuevos.departamento = "El departamento o casa debe incluir un número (máx. 10 caracteres).";
    }
    if (formulario.region === "") nuevos.region = "Selecciona una región.";
    if (formulario.comuna === "") nuevos.comuna = "Selecciona una comuna.";

    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  async function pagar(evento) {
    evento.preventDefault();
    setErrorGeneral("");
    if (!validar()) return;

    setEnviando(true);
    try {
      // POST /api/v1/boletas: solo se envían productos y cantidades. El backend toma el precio
      // vigente de la BD, valida el stock, lo descuenta y responde la boleta creada.
      const boleta = await crearOrden({
        nombre: formulario.nombre.trim(),
        apellidos: formulario.apellidos.trim(),
        correo: formulario.correo.trim(),
        calle: formulario.calle.trim(),
        departamento: formulario.departamento.trim() || null,
        region: formulario.region,
        comuna: formulario.comuna,
        indicaciones: formulario.indicaciones.trim() || null,
        metodoPago: formulario.metodoPago,
        items: items.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
      });

      if (boleta.estado === "PAGADA") {
        navegar(`/pago-exitoso/${boleta.id}`, { state: { boleta } });
        vaciar();
      } else {
        navegar(`/pago-error/${boleta.id}`, { state: { boleta } });
      }
    } catch (error) {
      // Ej.: 409 "Stock insuficiente..." o 400 con errores por campo.
      setErrores(erroresDeCampo(error));
      setErrorGeneral(mensajeError(error, "No se pudo procesar la compra."));
    } finally {
      setEnviando(false);
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
                    autoCompletar="given-name"
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
                    autoCompletar="family-name"
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
                    autoCompletar="email"
                    marcaAgua="nombre@gmail.com"
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
                    autoCompletar="street-address"
                    marcaAgua="Ej: Av. Providencia 1234"
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
                    autoCompletar="address-line2"
                    etiqueta="Depto. o casa (opcional)"
                    marcaAgua="Ej: 603"
                    valor={formulario.departamento}
                    error={errores.departamento}
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

              {(errorGeneral || Object.keys(errores).length > 0) && (
                <div className="mt-3">
                  <MensajeAlerta
                    mensaje={errorGeneral || "Revisa los campos marcados antes de continuar."}
                  />
                </div>
              )}

              <div className="d-flex justify-content-end mt-4">
                <Boton
                  tipo="submit"
                  etiqueta={enviando ? "Procesando pago..." : `Pagar ahora ${formatearPrecio(total)}`}
                  deshabilitado={enviando}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
