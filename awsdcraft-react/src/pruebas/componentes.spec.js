import Boton from "../componentes/Boton";
import BuscadorProductos from "../componentes/BuscadorProductos";
import ControlCantidad from "../componentes/ControlCantidad";
import ListaProductos from "../componentes/ListaProductos";
import MensajeAlerta from "../componentes/MensajeAlerta";
import TarjetaProducto from "../componentes/TarjetaProducto";
import { escribir, hacerClic, montar } from "./utilidadesPrueba";

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
  let vista;

  afterEach(() => vista && vista.desmontar());

  it("renderiza el nombre y el precio del producto recibido", () => {
    vista = montar(<TarjetaProducto producto={productoBase} onAgregar={() => {}} />);

    expect(vista.texto()).toContain("Teclado TKL 87 teclas");
    expect(vista.texto()).toContain("$ 49.990");
  });

  it("no muestra la etiqueta de descuento cuando el producto no está en oferta", () => {
    vista = montar(<TarjetaProducto producto={productoBase} onAgregar={() => {}} />);

    expect(vista.buscar(".badge")).toBeNull();
  });

  it("muestra la etiqueta de descuento cuando el producto está en oferta", () => {
    const enOferta = { ...productoBase, descuento: 15 };
    vista = montar(<TarjetaProducto producto={enOferta} onAgregar={() => {}} />);

    expect(vista.buscar(".badge").textContent).toBe("-15%");
    expect(vista.texto()).toContain("$ 42.492");
  });

  it("deshabilita el botón añadir cuando el producto no tiene stock", () => {
    const sinStock = { ...productoBase, stock: 0 };
    vista = montar(<TarjetaProducto producto={sinStock} onAgregar={() => {}} />);

    expect(vista.buscar("button").disabled).toBe(true);
    expect(vista.texto()).toContain("Sin stock");
  });
});

describe("ListaProductos", () => {
  let vista;

  afterEach(() => vista && vista.desmontar());

  it("renderiza todos los elementos del conjunto de datos", () => {
    vista = montar(<ListaProductos productos={conjuntoProductos} onAgregar={() => {}} />);

    expect(vista.buscarTodos(".product-card").length).toBe(3);
    expect(vista.texto()).toContain("Teclado 60% Compacto");
  });

  it("muestra el mensaje de lista vacía cuando no hay productos", () => {
    vista = montar(
      <ListaProductos productos={[]} onAgregar={() => {}} mensajeVacio="Sin resultados" />
    );

    expect(vista.buscar("[data-testid='lista-productos']")).toBeNull();
    expect(vista.texto()).toContain("Sin resultados");
  });
});

describe("MensajeAlerta", () => {
  let vista;

  afterEach(() => vista && vista.desmontar());

  it("no renderiza nada cuando no hay mensaje", () => {
    vista = montar(<MensajeAlerta mensaje="" />);

    expect(vista.buscar(".alert")).toBeNull();
  });

  it("renderiza el mensaje de error solo cuando existe un error", () => {
    vista = montar(<MensajeAlerta mensaje="El correo no es válido" tipo="danger" />);

    expect(vista.buscar(".alert-danger").textContent).toBe("El correo no es válido");
  });
});

describe("Boton", () => {
  let vista;

  afterEach(() => vista && vista.desmontar());

  it("recibe la etiqueta por props y la muestra en el botón", () => {
    vista = montar(<Boton etiqueta="Añadir al carrito" onClick={() => {}} />);

    expect(vista.buscar("button").textContent).toContain("Añadir al carrito");
  });

  it("ejecuta la función onClick recibida por props al hacer clic", () => {
    const espia = jasmine.createSpy("onClick");
    vista = montar(<Boton etiqueta="Pagar" onClick={espia} />);

    hacerClic(vista.buscar("button"));

    expect(espia).toHaveBeenCalledTimes(1);
  });

  it("no ejecuta onClick cuando el botón está deshabilitado", () => {
    const espia = jasmine.createSpy("onClick");
    vista = montar(<Boton etiqueta="Pagar" onClick={espia} deshabilitado />);

    hacerClic(vista.buscar("button"));

    expect(espia).not.toHaveBeenCalled();
  });
});

describe("BuscadorProductos", () => {
  let vista;

  afterEach(() => vista && vista.desmontar());

  it("actualiza su estado interno cuando el usuario escribe", () => {
    vista = montar(<BuscadorProductos onBuscar={() => {}} />);
    const campo = vista.buscar("#buscador");

    escribir(campo, "teclado");

    expect(vista.buscar("#buscador").value).toBe("teclado");
  });

  it("informa el término ingresado al componente padre", () => {
    const espia = jasmine.createSpy("onBuscar");
    vista = montar(<BuscadorProductos onBuscar={espia} />);

    escribir(vista.buscar("#buscador"), "keycaps");

    expect(espia).toHaveBeenCalledWith("keycaps");
  });
});

describe("ControlCantidad", () => {
  let vista;

  afterEach(() => vista && vista.desmontar());

  it("aumenta la cantidad al hacer clic en el botón de sumar", () => {
    const espia = jasmine.createSpy("onCambiar");
    vista = montar(<ControlCantidad cantidad={2} maximo={5} onCambiar={espia} />);

    hacerClic(vista.buscar("[aria-label='Aumentar']"));

    expect(espia).toHaveBeenCalledWith(3);
  });

  it("no permite bajar de una unidad ni superar el stock máximo", () => {
    const espia = jasmine.createSpy("onCambiar");
    vista = montar(<ControlCantidad cantidad={1} maximo={3} onCambiar={espia} />);

    hacerClic(vista.buscar("[aria-label='Disminuir']"));
    expect(espia).toHaveBeenCalledWith(1);

    vista.desmontar();
    vista = montar(<ControlCantidad cantidad={3} maximo={3} onCambiar={espia} />);

    hacerClic(vista.buscar("[aria-label='Aumentar']"));
    expect(espia).toHaveBeenCalledWith(3);
  });
});
