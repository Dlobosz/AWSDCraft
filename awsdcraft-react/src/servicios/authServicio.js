import api from "./api";

// Endpoints de autenticación del backend (/api/v1/auth).

export async function login(correo, password) {
  const { data } = await api.post("/auth/login", { correo, password });
  return data; // { accessToken, refreshToken, tipo, expiraEn, usuario }
}

export async function registrar(datos) {
  const { data } = await api.post("/auth/registro", datos);
  return data;
}

export async function logout(refreshToken) {
  await api.post("/auth/logout", { refreshToken });
}

export async function obtenerPerfil() {
  const { data } = await api.get("/auth/perfil");
  return data;
}
