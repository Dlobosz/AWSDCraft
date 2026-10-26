import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";

import ProductoForm from "../paginas/admin/ProductoForm";
import { listarProductos, obtenerProducto } from "../servicios/productosServicio";

function montarFormulario(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/admin/productos/:id/editar" element={<ProductoForm />} />
        <Route path="/admin/productos" element={<p>Listado de productos</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProductoForm", () => {
  beforeEach(() => {
    listarProductos();
  });

  it("carga los datos del producto que se está editando", () => {
    montarFormulario("/admin/productos/1/editar");

    expect(screen.getByLabelText(/^Código/)).toHaveValue("TCL-001");
    expect(screen.getByLabelText(/^Stock\*/)).toHaveValue(14);
  });

  it("guarda el stock en cero y vuelve al listado", async () => {
    const usuario = userEvent.setup();
    montarFormulario("/admin/productos/1/editar");

    const campoStock = screen.getByLabelText(/^Stock\*/);
    await usuario.clear(campoStock);
    await usuario.type(campoStock, "0");
    await usuario.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(obtenerProducto(1).stock).toBe(0);
    expect(screen.getByText("Listado de productos")).toBeInTheDocument();
  });

  it("guarda un stock bajo sin alterar el resto de los datos", async () => {
    const usuario = userEvent.setup();
    const original = obtenerProducto(2);
    montarFormulario("/admin/productos/2/editar");

    const campoStock = screen.getByLabelText(/^Stock\*/);
    await usuario.clear(campoStock);
    await usuario.type(campoStock, "4");
    await usuario.click(screen.getByRole("button", { name: "Guardar cambios" }));

    const actualizado = obtenerProducto(2);
    expect(actualizado.stock).toBe(4);
    expect(actualizado.nombre).toBe(original.nombre);
    expect(actualizado.precio).toBe(original.precio);
  });

  it("avisa al usuario cuando el formulario tiene campos inválidos", async () => {
    const usuario = userEvent.setup();
    montarFormulario("/admin/productos/1/editar");

    const campoStock = screen.getByLabelText(/^Stock\*/);
    await usuario.clear(campoStock);
    await usuario.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(screen.getByRole("alert")).toHaveTextContent("No se pudo guardar");
    expect(screen.queryByText("Listado de productos")).not.toBeInTheDocument();
  });

  it("rechaza un stock negativo en lugar de guardarlo", async () => {
    const usuario = userEvent.setup();
    montarFormulario("/admin/productos/1/editar");

    const campoStock = screen.getByLabelText(/^Stock\*/);
    await usuario.clear(campoStock);
    await usuario.type(campoStock, "-5");
    await usuario.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(obtenerProducto(1).stock).toBe(14);
  });
});
