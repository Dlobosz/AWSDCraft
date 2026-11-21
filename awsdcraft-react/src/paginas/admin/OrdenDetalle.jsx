import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EstadoCarga from "../../componentes/EstadoCarga";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import ResumenOrden from "../../componentes/ResumenOrden";
import { useSesion } from "../../contexto/SesionContexto";
import { useCarga } from "../../hooks/useCarga";
import { mensajeError } from "../../servicios/api";
import { cambiarEstadoOrden, eliminarOrden, obtenerOrden } from "../../servicios/ordenesServicio";
import { claseEstado, estadosSiguientes, etiquetaEstado } from "../../utilidades/estados";
import { formatearFechaHora } from "../../utilidades/formato";

export default function OrdenDetalle() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { puede } = useSesion();
  const puedeGestionar = puede("gestionarOrdenes"); // solo ADMIN

  const { datos: orden, cargando, error, setDatos } = useCarga(() => obtenerOrden(id), [id]);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [aviso, setAviso] = useState("");
  const [errorAccion, setErrorAccion] = useState("");

  async function actualizarEstado() {
    if (!nuevoEstado) return;
    setErrorAccion("");
    try {
      // PATCH /api/v1/boletas/{id}/estado. Si se anula, el backend repone el stock.
      const actualizada = await cambiarEstadoOrden(orden.id, nuevoEstado);
      setDatos(actualizada);
      setNuevoEstado("");
      setAviso(`La boleta quedó en estado ${etiquetaEstado(actualizada.estado)}.`);
    } catch (e) {
      setErrorAccion(mensajeError(e));
    }
  }

  async function borrar() {
    if (!window.confirm(`¿Eliminar la boleta ${orden.codigo}? Esta acción no se puede deshacer.`)) return;
    try {
      await eliminarOrden(orden.id);
      navegar("/admin/ordenes");
    } catch (e) {
      setErrorAccion(mensajeError(e));
    }
  }

  if (cargando || error) {
    return (
      <>
        <EstadoCarga cargando={cargando} error={error} texto="Cargando boleta..." />
        {error && (
          <Link to="/admin/ordenes" className="btn btn-awsd">
            Volver al listado
          </Link>
        )}
      </>
    );
  }

  const siguientes = estadosSiguientes(orden.estado);
  const eliminable = orden.estado === "RECHAZADA" || orden.estado === "ANULADA";

  return (
    <>
      <h1 className="awsd-title h3 mb-1">Boleta {orden.codigo}</h1>
      <p className="text-secondary small mb-4">
        Emitida el {formatearFechaHora(orden.fecha)} · Estado:{" "}
        <span className={`badge ${claseEstado(orden.estado)}`}>{etiquetaEstado(orden.estado)}</span>
      </p>

      <MensajeAlerta mensaje={aviso} tipo="success" />
      <MensajeAlerta mensaje={errorAccion} />

      {/* Gestión de la boleta: solo se dibuja para el ADMIN. El VENDEDOR la ve en modo lectura. */}
      {puedeGestionar && (siguientes.length > 0 || eliminable) && (
        <div className="awsd-card border p-3 mb-3 d-flex flex-wrap gap-2 align-items-center">
          {siguientes.length > 0 && (
            <>
              <select
                className="form-select w-auto"
                value={nuevoEstado}
                onChange={(evento) => setNuevoEstado(evento.target.value)}
                aria-label="Nuevo estado"
              >
                <option value="">Cambiar estado a...</option>
                {siguientes.map((estado) => (
                  <option key={estado} value={estado}>
                    {etiquetaEstado(estado)}
                  </option>
                ))}
              </select>
              <button className="btn btn-awsd" onClick={actualizarEstado} disabled={!nuevoEstado}>
                Actualizar estado
              </button>
            </>
          )}
          {eliminable && (
            <button className="btn btn-outline-danger ms-auto" onClick={borrar}>
              Eliminar boleta
            </button>
          )}
        </div>
      )}

      <div className="awsd-card border p-4">
        <ResumenOrden orden={orden} />

        <div className="d-flex gap-2 justify-content-center mt-4">
          <button className="btn btn-awsd" onClick={() => window.print()}>
            Imprimir boleta
          </button>
          <Link to="/admin/ordenes" className="btn btn-outline-secondary">
            Volver
          </Link>
        </div>
      </div>
    </>
  );
}
