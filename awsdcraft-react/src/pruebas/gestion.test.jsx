import { describe, expect, it } from "vitest";

import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  listarCategorias,
  obtenerCategoria,
} from "../servicios/categoriasServicio";
import {
  actualizarUsuario,
  buscarPorCorreo,
  crearUsuario,
  eliminarUsuario,
  listarUsuarios,
  obtenerUsuario,
} from "../servicios/usuariosServicio";
import {
  actualizarOrden,
  crearOrden,
  eliminarOrden,
  listarOrdenesDeCorreo,
  obtenerOrden,
} from "../servicios/ordenesServicio";
import { formatearFecha } from "../utilidades/formato";

describe("Servicio de categorías", () => {
  it("carga las categorías semilla y permite buscarlas por identificador", () => {
    expect(listarCategorias()).toHaveLength(5);
    expect(obtenerCategoria("teclados").nombre).toBe("Teclados");
    expect(obtenerCategoria("inexistente")).toBeNull();
  });

  it("crea, actualiza y elimina una categoría", () => {
    const creada = crearCategoria({ slug: "alfombrillas", nombre: "Alfombrillas", descripcion: "Mousepads" });
    expect(creada.id).toBe(6);
    expect(listarCategorias()).toHaveLength(6);

    actualizarCategoria(creada.id, { nombre: "Alfombrillas XL" });
    expect(obtenerCategoria("alfombrillas").nombre).toBe("Alfombrillas XL");

    expect(eliminarCategoria(creada.id)).toHaveLength(5);
  });
});

describe("Servicio de usuarios", () => {
  it("carga los usuarios semilla y los encuentra por correo sin distinguir mayúsculas", () => {
    expect(listarUsuarios()).toHaveLength(3);
    expect(buscarPorCorreo("DIEGOLOBOS@GMAIL.COM").tipoUsuario).toBe("Administrador");
    expect(buscarPorCorreo("nadie@gmail.com")).toBeNull();
  });

  it("crea, actualiza y elimina un usuario", () => {
    const creado = crearUsuario({
      run: "178234560",
      nombre: "Ana",
      apellidos: "Soto",
      correo: "ana.soto@duoc.cl",
      tipoUsuario: "Cliente",
    });
    expect(creado.id).toBe(4);

    actualizarUsuario(creado.id, { tipoUsuario: "Vendedor" });
    expect(obtenerUsuario(creado.id).tipoUsuario).toBe("Vendedor");

    expect(eliminarUsuario(creado.id)).toHaveLength(3);
  });
});

describe("Servicio de órdenes", () => {
  it("asocia las órdenes al correo del cliente", () => {
    crearOrden({ correo: "cliente@gmail.com", items: [], total: 1000, estado: "Pagada" });
    crearOrden({ correo: "otro@gmail.com", items: [], total: 2000, estado: "Pagada" });

    expect(listarOrdenesDeCorreo("CLIENTE@GMAIL.COM")).toHaveLength(1);
  });

  it("actualiza y elimina una orden existente", () => {
    const orden = crearOrden({ correo: "cliente@gmail.com", items: [], total: 1000, estado: "Rechazada" });

    actualizarOrden(orden.id, { estado: "Pagada" });
    expect(obtenerOrden(orden.id).estado).toBe("Pagada");

    expect(eliminarOrden(orden.id)).toHaveLength(0);
    expect(obtenerOrden(orden.id)).toBeNull();
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
