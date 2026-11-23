import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import RutaProtegida from "../componentes/RutaProtegida";
import { ProveedorSesion } from "../contexto/SesionContexto";
import LayoutAdmin from "../layouts/LayoutAdmin";
import api from "../servicios/api";
import {
  cerrarSesionGuardada,
  guardarSesion,
  leerPayload,
  leerSesion,
  tokenPorVencer,
} from "../servicios/sesion";
import { decidirAcceso, rutaInicial, tienePermiso } from "../utilidades/permisos";

/** Crea un JWT de prueba (sin firma real) que vence en los segundos indicados. */
function tokenQueVenceEn(segundos) {
  const base64url = (objeto) =>
    btoa(JSON.stringify(objeto)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const exp = Math.floor(Date.now() / 1000) + segundos;
  return `${base64url({ alg: "HS512" })}.${base64url({ sub: "test@gmail.com", exp })}.firma`;
}

const vendedor = { id: 2, nombre: "Camila", correo: "camila.reyes@duoc.cl", rol: "VENDEDOR" };
const cliente = { id: 3, nombre: "Javier", correo: "javier.munoz@gmail.com", rol: "CLIENTE" };
const admin = { id: 1, nombre: "Diego", correo: "diegolobos@gmail.com", rol: "ADMIN" };

function iniciarSesionComo(usuario) {
  guardarSesion({ accessToken: tokenQueVenceEn(600), refreshToken: "r", usuario });
  // GET /auth/perfil: el backend confirma la sesión al recargar la página.
  vi.spyOn(api, "get").mockResolvedValue({ data: usuario });
}

describe("Gestión de sesión en sessionStorage", () => {
  it("guarda y recupera la sesión (sobrevive a una recarga de página)", () => {
    guardarSesion({ accessToken: "a.b.c", refreshToken: "r", usuario: vendedor, otro: "ignorado" });

    const sesion = leerSesion();

    expect(sesion.usuario.rol).toBe("VENDEDOR");
    expect(sesion.refreshToken).toBe("r");
    expect(sesion.otro).toBeUndefined();
  });

  it("descarta una sesión corrupta o incompleta", () => {
    sessionStorage.setItem("awsdcraft_sesion", "{no es json");
    expect(leerSesion()).toBeNull();

    sessionStorage.setItem("awsdcraft_sesion", JSON.stringify({ accessToken: "x" }));
    expect(leerSesion()).toBeNull();
  });

  it("cierra la sesión eliminando los tokens guardados", () => {
    guardarSesion({ accessToken: "a.b.c", refreshToken: "r", usuario: vendedor });
    cerrarSesionGuardada();
    expect(leerSesion()).toBeNull();
  });

  it("detecta cuándo el JWT está vencido o por vencer", () => {
    expect(tokenPorVencer(tokenQueVenceEn(600))).toBe(false);
    expect(tokenPorVencer(tokenQueVenceEn(10))).toBe(true); // dentro del margen de 30 s
    expect(tokenPorVencer(tokenQueVenceEn(-60))).toBe(true);
    expect(tokenPorVencer("token-invalido")).toBe(true);
    expect(leerPayload(tokenQueVenceEn(600)).sub).toBe("test@gmail.com");
  });
});

describe("Interceptor de axios", () => {
  const interceptor = () => api.interceptors.request.handlers[0].fulfilled;

  it("agrega el header Authorization: Bearer cuando hay sesión vigente", async () => {
    const token = tokenQueVenceEn(600);
    guardarSesion({ accessToken: token, refreshToken: "r", usuario: admin });

    const config = await interceptor()({ url: "/usuarios", headers: {} });

    expect(config.headers.Authorization).toBe(`Bearer ${token}`);
  });

  it("no agrega Authorization cuando no hay sesión", async () => {
    const config = await interceptor()({ url: "/productos", headers: {} });

    expect(config.headers.Authorization).toBeUndefined();
  });
});

describe("Permisos por rol", () => {
  it("el VENDEDOR solo ve productos y órdenes, sin poder gestionarlos", () => {
    expect(tienePermiso(vendedor, "panel")).toBe(true);
    expect(tienePermiso(vendedor, "verProductos")).toBe(true);
    expect(tienePermiso(vendedor, "verOrdenes")).toBe(true);
    expect(tienePermiso(vendedor, "gestionarProductos")).toBe(false);
    expect(tienePermiso(vendedor, "gestionarOrdenes")).toBe(false);
    expect(tienePermiso(vendedor, "usuarios")).toBe(false);
    expect(tienePermiso(vendedor, "dashboard")).toBe(false);
  });

  it("el CLIENTE no puede entrar al panel y el ADMIN puede todo", () => {
    expect(tienePermiso(cliente, "panel")).toBe(false);
    ["panel", "dashboard", "usuarios", "reportes", "gestionarProductos"].forEach((permiso) =>
      expect(tienePermiso(admin, permiso)).toBe(true)
    );
    expect(tienePermiso(null, "verProductos")).toBe(false);
  });

  it("decide si una ruta protegida pide login, se deniega o se permite", () => {
    expect(decidirAcceso(null, ["ADMIN"])).toBe("login");
    expect(decidirAcceso(cliente, ["ADMIN", "VENDEDOR"])).toBe("denegado");
    expect(decidirAcceso(vendedor, ["ADMIN", "VENDEDOR"])).toBe("permitido");
    expect(decidirAcceso(cliente, undefined)).toBe("permitido");
  });

  it("envía a cada rol a su pantalla inicial después del login", () => {
    expect(rutaInicial(admin)).toBe("/admin");
    expect(rutaInicial(vendedor)).toBe("/admin/productos");
    expect(rutaInicial(cliente)).toBe("/");
  });
});

describe("RutaProtegida", () => {
  function montar(ruta) {
    return render(
      <ProveedorSesion>
        <MemoryRouter initialEntries={[ruta]}>
          <Routes>
            <Route
              path="/admin/usuarios"
              element={
                <RutaProtegida permiso="usuarios">
                  <p>Mantenedor de usuarios</p>
                </RutaProtegida>
              }
            />
            <Route path="/login" element={<p>Pantalla de login</p>} />
          </Routes>
        </MemoryRouter>
      </ProveedorSesion>
    );
  }

  beforeEach(() => sessionStorage.clear());

  it("redirige al login cuando no hay sesión", async () => {
    montar("/admin/usuarios");

    expect(await screen.findByText("Pantalla de login")).toBeInTheDocument();
    expect(screen.queryByText("Mantenedor de usuarios")).not.toBeInTheDocument();
  });

  it("muestra Acceso denegado a un VENDEDOR que intenta abrir Usuarios", async () => {
    iniciarSesionComo(vendedor);
    montar("/admin/usuarios");

    expect(await screen.findByText("Acceso denegado")).toBeInTheDocument();
    expect(screen.queryByText("Mantenedor de usuarios")).not.toBeInTheDocument();
  });

  it("permite el acceso al ADMIN después de validar la sesión con el backend", async () => {
    iniciarSesionComo(admin);
    montar("/admin/usuarios");

    expect(await screen.findByText("Mantenedor de usuarios")).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith("/auth/perfil");
  });
});

describe("Menú del panel según el rol", () => {
  function montarPanel() {
    return render(
      <ProveedorSesion>
        <MemoryRouter initialEntries={["/admin"]}>
          <Routes>
            <Route path="/admin" element={<LayoutAdmin />} />
          </Routes>
        </MemoryRouter>
      </ProveedorSesion>
    );
  }

  it("el VENDEDOR solo ve las opciones Órdenes y Productos", async () => {
    iniciarSesionComo(vendedor);
    montarPanel();

    expect(await screen.findByRole("link", { name: /Órdenes/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Productos/ })).toBeInTheDocument();
    ["Dashboard", "Usuarios", "Categorías", "Reportes", "Stock crítico", "Perfil"].forEach((opcion) =>
      expect(screen.queryByRole("link", { name: new RegExp(opcion) })).not.toBeInTheDocument()
    );
  });

  it("el ADMIN ve todas las opciones del panel", async () => {
    iniciarSesionComo(admin);
    montarPanel();

    expect(await screen.findByRole("link", { name: /Usuarios/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Reportes/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Dashboard/ })).toBeInTheDocument();
  });
});
