import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import Boton from "../componentes/Boton";
import BuscadorProductos from "../componentes/BuscadorProductos";
import ControlCantidad from "../componentes/ControlCantidad";
import ListaProductos from "../componentes/ListaProductos";
import MensajeAlerta from "../componentes/MensajeAlerta";
import TarjetaProducto from "../componentes/TarjetaProducto";

function montar(elemento) {
  return render(<MemoryRouter>{elemento}</MemoryRouter>);
}

const productoBase = {
  id: 1,
  codigo: "TCL-001",
  nombre: "Teclado TKL 87 teclas",
  categoria: "teclados",
  precio: 49990,
  stock: 14,
  stockCritico: 3,
  switch: "Red (lineal)",
  descripcion: "Teclado mecánico TenKeyLess.",
  imagen: "teclado-87.webp",
  destacado: true,
  descuento: 0,
};

const conjuntoProductos = [
  { ...productoBase, id: 1, nombre: "Teclado TKL 87 teclas" },
  { ...productoBase, id: 2, nombre: "Teclado Full Size 108 teclas" },
  { ...productoBase, id: 3, nombre: "Teclado 60% Compacto" },
];

describe("TarjetaProducto", () => {
  it("renderiza el nombre y el precio del producto recibido", () => {
    montar(<TarjetaProducto producto={productoBase} onAgregar={() => {}} />);

    expect(screen.getByText("Teclado TKL 87 teclas")).toBeInTheDocument();
    expect(screen.getByText(/\$ 49\.990/)).toBeInTheDocument();
  });

  it("no muestra la etiqueta de descuento cuando el producto no está en oferta", () => {
    const { container } = montar(<TarjetaProducto producto={productoBase} onAgregar={() => {}} />);

    expect(container.querySelector(".badge")).toBeNull();
  });

  it("muestra la etiqueta de descuento cuando el producto está en oferta", () => {
    const enOferta = { ...productoBase, descuento: 15 };
    montar(<TarjetaProducto producto={enOferta} onAgregar={() => {}} />);

    expect(screen.getByText("-15%")).toBeInTheDocument();
    expect(screen.getByText(/\$ 42\.492/)).toBeInTheDocument();
  });

  it("deshabilita el botón añadir cuando el producto no tiene stock", () => {
    const sinStock = { ...productoBase, stock: 0 };
    montar(<TarjetaProducto producto={sinStock} onAgregar={() => {}} />);

    expect(screen.getByRole("button", { name: "Añadir" })).toBeDisabled();
    expect(screen.getByText("Sin stock")).toBeInTheDocument();
  });

  it("entrega el producto completo al componente padre al añadirlo", async () => {
    const usuario = userEvent.setup();
    const alAgregar = vi.fn();
    montar(<TarjetaProducto producto={productoBase} onAgregar={alAgregar} />);

    await usuario.click(screen.getByRole("button", { name: "Añadir" }));

    expect(alAgregar).toHaveBeenCalledWith(productoBase);
  });
});

describe("ListaProductos", () => {
  it("renderiza todos los elementos del conjunto de datos", () => {
    const { container } = montar(
      <ListaProductos productos={conjuntoProductos} onAgregar={() => {}} />
    );

    expect(container.querySelectorAll(".product-card")).toHaveLength(3);
    expect(screen.getByText("Teclado 60% Compacto")).toBeInTheDocument();
  });

  it("muestra el mensaje de lista vacía cuando no hay productos", () => {
    montar(<ListaProductos productos={[]} onAgregar={() => {}} mensajeVacio="Sin resultados" />);

    expect(screen.queryByTestId("lista-productos")).not.toBeInTheDocument();
    expect(screen.getByText("Sin resultados")).toBeInTheDocument();
  });
});

describe("MensajeAlerta", () => {
  it("no renderiza nada cuando no hay mensaje", () => {
    montar(<MensajeAlerta mensaje="" />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renderiza el mensaje de error solo cuando existe un error", () => {
    montar(<MensajeAlerta mensaje="El correo no es válido" tipo="danger" />);

    const alerta = screen.getByRole("alert");
    expect(alerta).toHaveTextContent("El correo no es válido");
    expect(alerta).toHaveClass("alert-danger");
  });
});

describe("Boton", () => {
  it("recibe la etiqueta por props y la muestra en el botón", () => {
    montar(<Boton etiqueta="Añadir al carrito" onClick={() => {}} />);

    expect(screen.getByRole("button", { name: "Añadir al carrito" })).toBeInTheDocument();
  });

  it("ejecuta la función onClick recibida por props al hacer clic", async () => {
    const usuario = userEvent.setup();
    const alHacerClic = vi.fn();
    montar(<Boton etiqueta="Pagar" onClick={alHacerClic} />);

    await usuario.click(screen.getByRole("button", { name: "Pagar" }));

    expect(alHacerClic).toHaveBeenCalledTimes(1);
  });

  it("no ejecuta onClick cuando el botón está deshabilitado", async () => {
    const usuario = userEvent.setup();
    const alHacerClic = vi.fn();
    montar(<Boton etiqueta="Pagar" onClick={alHacerClic} deshabilitado />);

    await usuario.click(screen.getByRole("button", { name: "Pagar" }));

    expect(alHacerClic).not.toHaveBeenCalled();
  });
});

describe("BuscadorProductos", () => {
  it("actualiza su estado interno cuando el usuario escribe", async () => {
    const usuario = userEvent.setup();
    montar(<BuscadorProductos onBuscar={() => {}} />);
    const campo = screen.getByPlaceholderText("Buscar por nombre o código");

    await usuario.type(campo, "teclado");

    expect(campo).toHaveValue("teclado");
  });

  it("informa el término ingresado al componente padre", async () => {
    const usuario = userEvent.setup();
    const alBuscar = vi.fn();
    montar(<BuscadorProductos onBuscar={alBuscar} />);

    await usuario.type(screen.getByPlaceholderText("Buscar por nombre o código"), "kit");

    expect(alBuscar).toHaveBeenLastCalledWith("kit");
  });
});

describe("ControlCantidad", () => {
  it("aumenta la cantidad al hacer clic en el botón de sumar", async () => {
    const usuario = userEvent.setup();
    const alCambiar = vi.fn();
    montar(<ControlCantidad cantidad={2} maximo={5} onCambiar={alCambiar} />);

    await usuario.click(screen.getByLabelText("Aumentar"));

    expect(alCambiar).toHaveBeenCalledWith(3);
  });

  it("disminuye la cantidad al hacer clic en el botón de restar", async () => {
    const usuario = userEvent.setup();
    const alCambiar = vi.fn();
    montar(<ControlCantidad cantidad={2} maximo={5} onCambiar={alCambiar} />);

    await usuario.click(screen.getByLabelText("Disminuir"));

    expect(alCambiar).toHaveBeenCalledWith(1);
  });

  it("no permite bajar de una unidad ni superar el stock máximo", async () => {
    const usuario = userEvent.setup();
    const alCambiar = vi.fn();

    const { unmount } = montar(<ControlCantidad cantidad={1} maximo={3} onCambiar={alCambiar} />);
    await usuario.click(screen.getByLabelText("Disminuir"));
    expect(alCambiar).toHaveBeenCalledWith(1);
    unmount();

    montar(<ControlCantidad cantidad={3} maximo={3} onCambiar={alCambiar} />);
    await usuario.click(screen.getByLabelText("Aumentar"));
    expect(alCambiar).toHaveBeenCalledWith(3);
  });
});
