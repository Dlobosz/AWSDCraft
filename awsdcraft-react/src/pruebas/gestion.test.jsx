import { describe, expect, it, vi } from "vitest";

import api from "../servicios/api";
import { login, logout, obtenerPerfil, registrar } from "../servicios/authServicio";
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  listarCategorias,
  obtenerCategoriaPorSlug,
} from "../servicios/categoriasServicio";
import {
  cambiarEstadoOrden,
  crearOrden,
  eliminarOrden,
  leerUltimaBoleta,
  listarMisOrdenes,
  listarOrdenes,
} from "../servicios/ordenesServicio";
import { obtenerResumen } from "../servicios/reportesServicio";
import {
  actualizarUsuario,
  crearUsuario,
  eliminarUsuario,
  listarUsuarios,
} from "../servicios/usuariosServicio";
import { claseEstado, estadosSiguientes, etiquetaEstado } from "../utilidades/estados";
import { formatearFecha } from "../utilidades/formato";

describe("Servicio de autenticación", () => {
  it("inicia sesión con POST /auth/login y devuelve tokens y usuario", async () => {
    const respuesta = { accessToken: "a", refreshToken: "r", usuario: { rol: "ADMIN" } };
    vi.spyOn(api, "post").mockResolvedValue({ data: respuesta });

    const datos = await login("diegolobos@gmail.com", "Admin123");

    expect(api.post).toHaveBeenCalledWith("/auth/login", {
      correo: "diegolobos@gmail.com",
      password: "Admin123",
    });
    expect(datos.usuario.rol).toBe("ADMIN");
  });

  it("registra, consulta el perfil y cierra sesión revocando el refresh token", async () => {
    vi.spyOn(api, "post").mockResolvedValue({ data: {} });
    vi.spyOn(api, "get").mockResolvedValue({ data: { correo: "ana@gmail.com" } });

    await registrar({ correo: "ana@gmail.com" });
    const perfil = await obtenerPerfil();
    await logout("refresh-123");

    expect(api.post).toHaveBeenNthCalledWith(1, "/auth/registro", { correo: "ana@gmail.com" });
    expect(api.get).toHaveBeenCalledWith("/auth/perfil");
    expect(perfil.correo).toBe("ana@gmail.com");
    expect(api.post).toHaveBeenNthCalledWith(2, "/auth/logout", { refreshToken: "refresh-123" });
  });
});

describe("Servicio de categorías", () => {
  it("lista y busca por slug con GET", async () => {
    vi.spyOn(api, "get").mockResolvedValue({ data: [] });

    await listarCategorias();
    await obtenerCategoriaPorSlug("teclados");

    expect(api.get).toHaveBeenNthCalledWith(1, "/categorias");
    expect(api.get).toHaveBeenNthCalledWith(2, "/categorias/slug/teclados");
  });

  it("crea, actualiza y elimina con POST, PUT y DELETE", async () => {
    vi.spyOn(api, "post").mockResolvedValue({ data: { id: 6 } });
    vi.spyOn(api, "put").mockResolvedValue({ data: { id: 6 } });
    vi.spyOn(api, "delete").mockResolvedValue({ status: 204 });
    const categoria = { nombre: "Alfombrillas" };

    const creada = await crearCategoria(categoria);
    await actualizarCategoria(creada.id, categoria);
    await eliminarCategoria(creada.id);

    expect(api.post).toHaveBeenCalledWith("/categorias", categoria);
    expect(api.put).toHaveBeenCalledWith("/categorias/6", categoria);
    expect(api.delete).toHaveBeenCalledWith("/categorias/6");
  });
});

describe("Servicio de usuarios", () => {
  it("usa los endpoints del mantenedor de usuarios", async () => {
    vi.spyOn(api, "get").mockResolvedValue({ data: [] });
    vi.spyOn(api, "post").mockResolvedValue({ data: { id: 4 } });
    vi.spyOn(api, "put").mockResolvedValue({ data: { id: 4 } });
    vi.spyOn(api, "delete").mockResolvedValue({ status: 204 });
    const usuario = { correo: "ana.soto@duoc.cl", rol: "VENDEDOR" };

    await listarUsuarios();
    await crearUsuario(usuario);
    await actualizarUsuario(4, usuario);
    await eliminarUsuario(4);

    expect(api.get).toHaveBeenCalledWith("/usuarios");
    expect(api.post).toHaveBeenCalledWith("/usuarios", usuario);
    expect(api.put).toHaveBeenCalledWith("/usuarios/4", usuario);
    expect(api.delete).toHaveBeenCalledWith("/usuarios/4");
  });
});

describe("Servicio de órdenes (boletas)", () => {
  it("envía solo productos y cantidades al comprar y recuerda la boleta creada", async () => {
    const boleta = { id: 7, codigo: "BOL-10007", estado: "PAGADA", items: [] };
    vi.spyOn(api, "post").mockResolvedValue({ data: boleta });
    const orden = { nombre: "Javier", items: [{ productoId: 1, cantidad: 2 }] };

    const creada = await crearOrden(orden);

    expect(api.post).toHaveBeenCalledWith("/boletas", orden);
    expect(creada.codigo).toBe("BOL-10007");
    expect(leerUltimaBoleta(7).id).toBe(7);
    expect(leerUltimaBoleta(8)).toBeNull();
  });

  it("filtra por estado en el backend y consulta las compras propias", async () => {
    vi.spyOn(api, "get").mockResolvedValue({ data: [] });

    await listarOrdenes("PAGADA");
    await listarOrdenes();
    await listarMisOrdenes();

    expect(api.get).toHaveBeenNthCalledWith(1, "/boletas", { params: { estado: "PAGADA" } });
    expect(api.get).toHaveBeenNthCalledWith(2, "/boletas", { params: {} });
    expect(api.get).toHaveBeenNthCalledWith(3, "/boletas/mis-boletas");
  });

  it("cambia el estado con PATCH y elimina con DELETE", async () => {
    vi.spyOn(api, "patch").mockResolvedValue({ data: { id: 3, estado: "ENVIADA" } });
    vi.spyOn(api, "delete").mockResolvedValue({ status: 204 });

    const actualizada = await cambiarEstadoOrden(3, "ENVIADA");
    await eliminarOrden(3);

    expect(api.patch).toHaveBeenCalledWith("/boletas/3/estado", { estado: "ENVIADA" });
    expect(actualizada.estado).toBe("ENVIADA");
    expect(api.delete).toHaveBeenCalledWith("/boletas/3");
  });

  it("obtiene el resumen de reportes desde el backend", async () => {
    vi.spyOn(api, "get").mockResolvedValue({ data: { totalVendido: 1000 } });

    expect((await obtenerResumen()).totalVendido).toBe(1000);
    expect(api.get).toHaveBeenCalledWith("/reportes/resumen");
  });
});

describe("Estados de boleta", () => {
  it("muestra etiquetas legibles y las mismas transiciones que valida el backend", () => {
    expect(etiquetaEstado("PAGADA")).toBe("Pagada");
    expect(claseEstado("RECHAZADA")).toBe("bg-danger");
    expect(estadosSiguientes("PAGADA")).toEqual(["ENVIADA", "ANULADA"]);
    expect(estadosSiguientes("ANULADA")).toEqual([]);
  });
});

describe("Formato de fechas", () => {
  it("formatea una fecha ISO al formato chileno", () => {
    expect(formatearFecha("2026-10-24T12:00:00.000Z")).toMatch(/\d{2}-\d{2}-\d{4}/);
  });

  it("devuelve texto vacío cuando la fecha es inválida o no existe", () => {
    expect(formatearFecha("")).toBe("");
    expect(formatearFecha("no es fecha")).toBe("");
  });
});
