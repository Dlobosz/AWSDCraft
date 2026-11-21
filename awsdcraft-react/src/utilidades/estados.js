// Estados de boleta que devuelve el backend y cómo se muestran en pantalla.

export const ESTADOS_BOLETA = ["PAGADA", "ENVIADA", "RECHAZADA", "ANULADA"];

const ETIQUETAS = {
  PAGADA: "Pagada",
  ENVIADA: "Enviada",
  RECHAZADA: "Rechazada",
  ANULADA: "Anulada",
};

const CLASES = {
  PAGADA: "bg-success",
  ENVIADA: "bg-primary",
  RECHAZADA: "bg-danger",
  ANULADA: "bg-secondary",
};

// Mismas transiciones que valida el backend (EstadoBoleta.puedeCambiarA).
const TRANSICIONES = {
  PAGADA: ["ENVIADA", "ANULADA"],
  ENVIADA: ["ANULADA"],
  RECHAZADA: [],
  ANULADA: [],
};

export function etiquetaEstado(estado) {
  return ETIQUETAS[estado] || estado;
}

export function claseEstado(estado) {
  return CLASES[estado] || "bg-secondary";
}

export function estadosSiguientes(estado) {
  return TRANSICIONES[estado] || [];
}
