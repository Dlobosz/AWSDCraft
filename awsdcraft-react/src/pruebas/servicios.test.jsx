import { beforeEach, describe, expect, it, vi } from "vitest";

import { CLAVES } from "../servicios/almacenamiento";
import {
  agregarItem,
  calcularTotal,
  cambiarCantidad,
  contarItems,
  quitarItem,
} from "../servicios/carritoServicio";
import {
  actualizarProducto,
  buscarProductos,
  crearProducto,
  descontarStock,
  eliminarProducto,
  listarCriticos,
  listarOfertas,
  listarProductos,
  obtenerProducto,
} from "../servicios/productosServicio";
import { crearOrden, listarOrdenes, totalVendido } from "../servicios/ordenesServicio";
import { formatearPrecio, precioConDescuento } from "../utilidades/formato";
import { correoPermitido, passwordValida, validarRun } from "../utilidades/validadores";

const producto = {
  id: 1,
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
    const carrito = agregarItem([], producto, 10);

    expect(carrito[0].cantidad).toBe(3);
  });

  it("calcula el total y la cantidad de unidades del carrito", () => {
    const carrito = agregarItem([], producto, 2);

    expect(calcularTotal(carrito)).toBe(100000);
    expect(contarItems(carrito)).toBe(2);
  });

  it("cambia la cantidad de una línea respetando los límites", () => {
    const carrito = cambiarCantidad(agregarItem([], producto, 1), 1, 99);

    expect(carrito[0].cantidad).toBe(3);
  });

  it("quita un producto del carrito", () => {
    const carrito = quitarItem(agregarItem([], producto, 1), 1);

    expect(carrito).toHaveLength(0);
  });
});

describe("Servicio de productos", () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, "setItem");
  });

  it("carga los productos semilla la primera vez y los guarda en localStorage", () => {
    const lista = listarProductos();

    expect(lista).toHaveLength(12);
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(localStorage.getItem(CLAVES.productos)).not.toBeNull();
  });

  it("crea un producto nuevo asignando el siguiente identificador", () => {
    const creado = crearProducto({ codigo: "TCL-099", nombre: "Teclado de prueba", precio: 1000 });

    expect(creado.id).toBe(13);
    expect(listarProductos()).toHaveLength(13);
  });

  it("actualiza el stock de un producto y lo persiste", () => {
    actualizarProducto(1, { stock: 0 });

    expect(obtenerProducto(1).stock).toBe(0);
    expect(obtenerProducto("1").stock).toBe(0);
  });

  it("conserva los campos que no se modifican al actualizar", () => {
    const original = obtenerProducto(2);
    actualizarProducto(2, { stock: 4 });
    const actualizado = obtenerProducto(2);

    expect(actualizado.stock).toBe(4);
    expect(actualizado.nombre).toBe(original.nombre);
    expect(actualizado.precio).toBe(original.precio);
  });

  it("elimina un producto existente de la colección", () => {
    const restantes = eliminarProducto(1);

    expect(restantes).toHaveLength(11);
    expect(restantes.find((item) => item.id === 1)).toBeUndefined();
  });

  it("filtra los productos por nombre o código", () => {
    const resultado = buscarProductos(listarProductos(), "keycaps");

    expect(resultado.length).toBeGreaterThan(0);
    expect(resultado.every((item) => item.nombre.toLowerCase().includes("keycaps"))).toBe(true);
  });

  it("lista solo los productos que tienen descuento", () => {
    const ofertas = listarOfertas();

    expect(ofertas.length).toBeGreaterThan(0);
    expect(ofertas.every((item) => item.descuento > 0)).toBe(true);
  });

  it("identifica los productos cuyo stock llegó al mínimo definido", () => {
    const criticos = listarCriticos();

    expect(criticos.every((item) => item.stock <= item.stockCritico)).toBe(true);
  });

  it("descuenta el stock de los productos comprados", () => {
    const antes = obtenerProducto(3).stock;
    descontarStock([{ id: 3, cantidad: 2 }]);

    expect(obtenerProducto(3).stock).toBe(antes - 2);
  });
});

describe("Servicio de órdenes", () => {
  it("crea una orden con código y fecha, y suma solo las pagadas", () => {
    crearOrden({ correo: "diegolobos@gmail.com", items: [], total: 10000, estado: "Pagada" });
    crearOrden({ correo: "diegolobos@gmail.com", items: [], total: 5000, estado: "Rechazada" });

    const ordenes = listarOrdenes();

    expect(ordenes).toHaveLength(2);
    expect(ordenes[0].codigo).toBe("ORDEN10001");
    expect(ordenes[0].fecha).toBeDefined();
    expect(totalVendido()).toBe(10000);
  });
});
