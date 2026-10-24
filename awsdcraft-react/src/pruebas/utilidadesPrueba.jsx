import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";

window.IS_REACT_ACT_ENVIRONMENT = true;

export function montar(elemento) {
  const contenedor = document.createElement("div");
  document.body.appendChild(contenedor);
  const raiz = createRoot(contenedor);

  act(() => {
    raiz.render(<MemoryRouter>{elemento}</MemoryRouter>);
  });

  return {
    contenedor,
    buscar: (selector) => contenedor.querySelector(selector),
    buscarTodos: (selector) => Array.from(contenedor.querySelectorAll(selector)),
    texto: () => contenedor.textContent,
    desmontar: () => {
      act(() => raiz.unmount());
      contenedor.remove();
    },
  };
}

export function hacerClic(elemento) {
  act(() => {
    elemento.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

export function escribir(campo, valor) {
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  ).set;

  act(() => {
    setter.call(campo, valor);
    campo.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
