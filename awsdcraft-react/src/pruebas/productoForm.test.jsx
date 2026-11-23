import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ProductoForm from "../paginas/admin/ProductoForm";
import api from "../servicios/api";

const categorias = [
  { id: 1, slug: "teclados", nombre: "Teclados" },
  { id: 2, slug: "kits", nombre: "Kits" },
];

const teclado = {
  id: 1,
  codigo: "TCL-001",
  nombre: "Teclado TKL 87 teclas",
  descripcion: "Teclado mecánico TenKeyLess.",
  precio: 49990,
  precioFinal: 42492,
  stock: 14,
  stockCritico: 3,
  tipoSwitch: "Red (lineal)",
  imagen: "teclado-87.webp",
  destacado: true,
  descuento: 15,
  categoriaId: 1,
  categoria: "teclados",
};

/** Simula las respuestas GET de la API: categorías y el producto que se edita. */
function simularApi() {
  vi.spyOn(api, "get").mockImplementation((url) =>
    Promise.resolve({ data: url === "/categorias" ? categorias : teclado })
  );
}

function Listado() {
  const ubicacion = useLocation();
  return <p>Listado de productos: {ubicacion.state?.aviso}</p>;
}

function montarFormulario(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/admin/productos/nuevo" element={<ProductoForm />} />
        <Route path="/admin/productos/:id/editar" element={<ProductoForm />} />
        <Route path="/admin/productos" element={<Listado />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProductoForm integrado con la API", () => {
  beforeEach(() => simularApi());

  it("carga desde la API los datos del producto que se está editando", async () => {
    montarFormulario("/admin/productos/1/editar");

    expect(await screen.findByLabelText(/^Código/)).toHaveValue("TCL-001");
    expect(screen.getByLabelText(/^Stock\*/)).toHaveValue(14);
    expect(api.get).toHaveBeenCalledWith("/productos/1");
    expect(api.get).toHaveBeenCalledWith("/categorias");
  });

  it("guarda el stock en cero con PUT y vuelve al listado con un aviso", async () => {
    const usuario = userEvent.setup();
    vi.spyOn(api, "put").mockResolvedValue({ data: { ...teclado, stock: 0 } });
    montarFormulario("/admin/productos/1/editar");

    const campoStock = await screen.findByLabelText(/^Stock\*/);
    await usuario.clear(campoStock);
    await usuario.type(campoStock, "0");
    await usuario.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(api.put).toHaveBeenCalledWith("/productos/1", expect.objectContaining({ stock: 0, categoriaId: 1 }));
    expect(await screen.findByText(/Listado de productos/)).toHaveTextContent("actualizado correctamente");
  });

  it("envía al backend solo los campos del contrato, sin alterar el resto de los datos", async () => {
    const usuario = userEvent.setup();
    vi.spyOn(api, "put").mockResolvedValue({ data: teclado });
    montarFormulario("/admin/productos/1/editar");

    const campoStock = await screen.findByLabelText(/^Stock\*/);
    await usuario.clear(campoStock);
    await usuario.type(campoStock, "4");
    await usuario.click(screen.getByRole("button", { name: "Guardar cambios" }));

    const enviado = api.put.mock.calls[0][1];
    expect(enviado.stock).toBe(4);
    expect(enviado.nombre).toBe(teclado.nombre);
    expect(enviado.precio).toBe(teclado.precio);
    expect(enviado).not.toHaveProperty("precioFinal");
  });

  it("avisa al usuario cuando el formulario tiene campos inválidos y no llama a la API", async () => {
    const usuario = userEvent.setup();
    vi.spyOn(api, "put");
    montarFormulario("/admin/productos/1/editar");

    const campoStock = await screen.findByLabelText(/^Stock\*/);
    await usuario.clear(campoStock);
    await usuario.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(screen.getByRole("alert")).toHaveTextContent("No se pudo guardar");
    expect(api.put).not.toHaveBeenCalled();
  });

  it("rechaza un stock negativo en lugar de guardarlo", async () => {
    const usuario = userEvent.setup();
    vi.spyOn(api, "put");
    montarFormulario("/admin/productos/1/editar");

    const campoStock = await screen.findByLabelText(/^Stock\*/);
    await usuario.clear(campoStock);
    await usuario.type(campoStock, "-5");
    await usuario.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
    expect(api.put).not.toHaveBeenCalled();
  });

  it("muestra el mensaje del backend cuando el código ya existe (409)", async () => {
    const usuario = userEvent.setup();
    vi.spyOn(api, "post").mockRejectedValue({
      response: { status: 409, data: { mensaje: "Ya existe un producto con el código TCL-001" } },
    });
    montarFormulario("/admin/productos/nuevo");

    await usuario.type(await screen.findByLabelText(/^Código/), "TCL-001");
    await usuario.type(screen.getByLabelText(/^Nombre/), "Duplicado");
    await usuario.type(screen.getByLabelText(/^Precio/), "1000");
    await usuario.type(screen.getByLabelText(/^Stock\*/), "1");
    await usuario.type(screen.getByLabelText(/^Stock crítico/), "0");
    await usuario.type(screen.getByLabelText(/^Descripción/), "Producto duplicado");
    await usuario.click(screen.getByRole("button", { name: "Crear producto" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Ya existe un producto con el código TCL-001");
  });
});
