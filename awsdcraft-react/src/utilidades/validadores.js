export function validarRun(run) {
  const limpio = String(run || "").trim().toUpperCase();

  if (!/^[0-9]+[0-9K]$/.test(limpio)) return false;
  if (limpio.length < 7 || limpio.length > 9) return false;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);

  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += multiplo * parseInt(cuerpo[i], 10);
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const resto = 11 - (suma % 11);
  let dvEsperado;
  if (resto === 11) dvEsperado = "0";
  else if (resto === 10) dvEsperado = "K";
  else dvEsperado = String(resto);

  return dv === dvEsperado;
}

/** Correo con al menos 3 caracteres antes de la @ y un dominio permitido. */
export function correoPermitido(correo) {
  return /^[^\s@]{3,}@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(String(correo || "").trim());
}

/** Texto obligatorio entre un mínimo y un máximo de caracteres (sin contar espacios de los extremos). */
export function textoRequerido(valor, largoMaximo, largoMinimo = 1) {
  const texto = String(valor || "").trim();
  return texto.length >= largoMinimo && texto.length <= largoMaximo;
}

/** Nombre o apellidos: al menos 2 letras; solo letras (con tildes y ñ), espacios, apóstrofo o guion. */
export function nombreValido(valor, largoMaximo) {
  const texto = String(valor || "").trim();
  return texto.length <= largoMaximo && /^\p{L}[\p{L}' -]*\p{L}$/u.test(texto);
}

/** Dirección: al menos 5 caracteres y debe incluir el número de la casa o edificio. */
export function direccionValida(valor, largoMaximo = 300) {
  const texto = String(valor || "").trim();
  return texto.length >= 5 && texto.length <= largoMaximo && /\d/.test(texto);
}

/** Número de departamento o casa (opcional): vacío, o hasta 10 caracteres con al menos un número. */
export function numeroOpcionalValido(valor) {
  const texto = String(valor || "").trim();
  return texto === "" || (texto.length <= 10 && /\d/.test(texto));
}

export function passwordValida(valor) {
  const texto = String(valor || "");
  return texto.length >= 4 && texto.length <= 10;
}
