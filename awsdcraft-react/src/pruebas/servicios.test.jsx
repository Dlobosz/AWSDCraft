import { describe, expect, it, vi } from "vitest";

import api, { mensajeError } from "../servicios/api";
import {
  agregarItem,
  calcularTotal,
  cambiarCantidad,
  contarItems,
  quitarItem,
} from "../servicios/carritoServicio";
import {
  buscarProductos,
  crearProducto,
  eliminarProducto,
  listarCriticos,
  listarOfertas,
  listarProductos,
  obtenerProducto,
} from "../servicios/productosServicio";
import { formatearPrecio, precioConDescuento } from "../utilidades/formato";
import { correoPermitido, passwordValida, validarRun } from "../utilidades/validadores";

const producto = {
  id: 1,
  codigo: "TCL-001",
  nombre: "Teclado TKL 87 teclas",
  precio: 50000,
  stock: 3,
  imagen: "teclado-87.webp",
  descuento: 0,
};

describe("Validadores del formulario", () => {
  it("acepta un RUN con dígito verificador correcto", () => {
    expect(validarRun("190110222")).toBe(true);
    expect(validarRun("156789038")).toBe(true);
  });

  it("rechaza un RUN con dígito verificador incorrecto o con formato inválido", () => {
    expect(validarRun("190110229")).toBe(false);
    expect(validarRun("19.011.022-2")).toBe(false);
    expect(validarRun("")).toBe(false);
  });

  it("acepta solo los dominios de correo permitidos", () => {
    expect(correoPermitido("diegolobos@gmail.com")).toBe(true);
    expect(correoPermitido("alumno@duoc.cl")).toBe(true);
    expect(correoPermitido("usuario@hotmail.com")).toBe(false);
  });

  it("exige una contraseña de entre 4 y 10 caracteres", () => {
    expect(passwordValida("1234")).toBe(true);
    expect(passwordValida("123")).toBe(false);
    expect(passwordValida("12345678901")).toBe(false);
  });
});

describe("Utilidades de formato", () => {
  it("formatea un precio en pesos chilenos", () => {
    expect(formatearPrecio(49990)).toBe("$ 49.990");
  });

  it("devuelve cero cuando el valor no es un número", () => {
    expect(formatearPrecio("abc")).toBe("$ 0");
  });

  it("aplica el porcentaje de descuento sobre el precio original", () => {
    expect(precioConDescuento({ precio: 50000, descuento: 20 })).toBe(40000);
    expect(precioConDescuento({ precio: 50000, descuento: 0 })).toBe(50000);
  });

  it("usa el precio final calculado por el backend cuando viene en la respuesta", () => {
    expect(precioConDescuento({ precio: 49990, descuento: 15, precioFinal: 42492 })).toBe(42492);
  });
});

describe("Servicio de carrito", () => {
  it("agrega un producto nuevo al carrito", () => {
    const carrito = agregarItem([], producto, 1);

    expect(carrito).toHaveLength(1);
    expect(carrito[0].nombre).toBe("Teclado TKL 87 teclas");
    expect(carrito[0].cantidad).toBe(1);
  });

  it("suma la cantidad cuando el producto ya está en el carrito", () => {
    const carrito = agregarItem(agregarItem([], producto, 1), producto, 1);

    expect(carrito).toHaveLength(1);
    expect(carrito[0].cantidad).toBe(2);
  });

  it("no permite agregar más unidades que el stock disponible", () => {
    expect(agregarItem([], producto, 10)[0].cantidad).toBe(3);
  });

  it("calcula el total y la cantidad de unidades del carrito", () => {
    const carrito = agregarItem([], producto, 2);

    expect(calcularTotal(carrito)).toBe(100000);
    expect(contarItems(carrito)).toBe(2);
  });

  it("cambia la cantidad de una línea respetando los límites", () => {
    expect(cambiarCantidad(agregarItem([], producto, 1), 1, 99)[0].cantidad).toBe(3);
  });

  it("quita un producto del carrito", () => {
    expect(quitarItem(agregarItem([], producto, 1), 1)).toHaveLength(0);
  });
});

describe("Servicios REST de productos (axios simulado)", () => {
  it("lista productos con GET /productos enviando los filtros como parámetros", async () => {
    vi.spyOn(api, "get").mockResolvedValue({ data: [producto] });

    const lista = await listarProductos({ categoria: "teclados" });

    expect(api.get).toHaveBeenCalledWith("/productos", { params: { categoria: "teclados" } });
    expect(lista).toEqual([producto]);
  });

  it("pide las ofertas al backend con el filtro ofertas=true", async () => {
    vi.spyOn(api, "get").mockResolvedValue({ data: [] });

    await listarOfertas();

    expect(api.get).toHaveBeenCalledWith("/productos", { params: { ofertas: true } });
  });

  it("consulta el detalle y el stock crítico en sus endpoints", async () => {
    vi.spyOn(api, "get").mockResolvedValue({ data: producto });

    await obtenerProducto(1);
    await listarCriticos();

    expect(api.get).toHaveBeenNthCalledWith(1, "/productos/1");
    expect(api.get).toHaveBeenNthCalledWith(2, "/productos/criticos");
  });

  it("crea un producto con POST y devuelve el registro creado por el backend", async () => {
    const nuevo = { codigo: "TCL-099", nombre: "Teclado de prueba", precio: 1000, categoriaId: 1 };
    vi.spyOn(api, "post").mockResolvedValue({ data: { ...nuevo, id: 13 } });

    const creado = await crearProducto(nuevo);

    expect(api.post).toHaveBeenCalledWith("/productos", nuevo);
    expect(creado.id).toBe(13);
  });

  it("elimina un producto con DELETE /productos/{id}", async () => {
    vi.spyOn(api, "delete").mockResolvedValue({ status: 204 });

    await eliminarProducto(5);

    expect(api.delete).toHaveBeenCalledWith("/productos/5");
  });

  it("propaga el error del backend para que la página muestre su mensaje", async () => {
    const error = { response: { status: 409, data: { mensaje: "Ya existe un producto con el código TCL-001" } } };
    vi.spyOn(api, "post").mockRejectedValue(error);

    await expect(crearProducto({ codigo: "TCL-001" })).rejects.toBe(error);
    expect(mensajeError(error)).toBe("Ya existe un producto con el código TCL-001");
  });

  it("filtra localmente por nombre o código una lista ya cargada", () => {
    const lista = [
      { ...producto, id: 1, nombre: "Set Keycaps PBT", codigo: "TCL-006" },
      { ...producto, id: 2, nombre: "Teclado 60%", codigo: "TCL-003" },
    ];

    expect(buscarProductos(lista, "keycaps")).toHaveLength(1);
    expect(buscarProductos(lista, "tcl-003")[0].id).toBe(2);
    expect(buscarProductos(lista, "")).toHaveLength(2);
  });
});

describe("Mensajes de error de la API", () => {
  it("avisa cuando no hay conexión con el servidor", () => {
    expect(mensajeError({ message: "Network Error" })).toContain("No se pudo conectar con el servidor");
  });

  it("usa un mensaje por defecto cuando el backend no envía uno", () => {
    expect(mensajeError({ response: { status: 500, data: {} } }, "Falló")).toBe("Falló");
  });
});
