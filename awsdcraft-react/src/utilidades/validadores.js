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

export function correoPermitido(correo) {
  return /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(String(correo || "").trim());
}

export function textoRequerido(valor, largoMaximo) {
  const texto = String(valor || "").trim();
  return texto !== "" && texto.length <= largoMaximo;
}

export function passwordValida(valor) {
  const texto = String(valor || "");
  return texto.length >= 4 && texto.length <= 10;
}
