import { Route, Routes } from "react-router-dom";
import RutaProtegida from "../componentes/RutaProtegida";
import { ProveedorSesion } from "../contexto/SesionContexto";
import api from "../servicios/api";
import {
  cerrarSesionGuardada,
  guardarSesion,
  leerPayload,
  leerSesion,
  tokenPorVencer,
} from "../servicios/sesion";
import { decidirAcceso, rutaInicial, tienePermiso } from "../utilidades/permisos";
import { esperar, montarEnRuta } from "./utilidadesPrueba";

/** Crea un JWT de prueba (sin firma real) con el vencimiento indicado en segundos. */
function tokenQueVenceEn(segundos) {
  const base64url = (objeto) =>
    btoa(JSON.stringify(objeto)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const exp = Math.floor(Date.now() / 1000) + segundos;
  return `${base64url({ alg: "HS512" })}.${base64url({ sub: "test@gmail.com", exp })}.firma`;
}

const vendedor = { id: 2, nombre: "Camila", correo: "camila.reyes@duoc.cl", rol: "VENDEDOR" };
const cliente = { id: 3, nombre: "Javier", correo: "javier.munoz@gmail.com", rol: "CLIENTE" };
const admin = { id: 1, nombre: "Diego", correo: "diegolobos@gmail.com", rol: "ADMIN" };

describe("Gestión de sesión en sessionStorage", () => {
  beforeEach(() => sessionStorage.clear());

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
  beforeEach(() => sessionStorage.clear());

  it("agrega el header Authorization: Bearer cuando hay sesión vigente", async () => {
    const token = tokenQueVenceEn(600);
    guardarSesion({ accessToken: token, refreshToken: "r", usuario: admin });
    const interceptor = api.interceptors.request.handlers[0].fulfilled;

    const config = await interceptor({ url: "/usuarios", headers: {} });

    expect(config.headers.Authorization).toBe(`Bearer ${token}`);
  });

  it("no agrega Authorization cuando no hay sesión", async () => {
    const interceptor = api.interceptors.request.handlers[0].fulfilled;

    const config = await interceptor({ url: "/productos", headers: {} });

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
  let vista;

  beforeEach(() => sessionStorage.clear());
  afterEach(() => vista && vista.desmontar());

  function aplicacion() {
    return (
      <ProveedorSesion>
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
      </ProveedorSesion>
    );
  }

  it("redirige al login cuando no hay sesión", async () => {
    vista = montarEnRuta(aplicacion(), "/admin/usuarios");
    await esperar();

    expect(vista.texto()).toContain("Pantalla de login");
    expect(vista.texto()).not.toContain("Mantenedor de usuarios");
  });

  it("muestra Acceso denegado a un VENDEDOR que intenta abrir Usuarios", async () => {
    guardarSesion({ accessToken: tokenQueVenceEn(600), refreshToken: "r", usuario: vendedor });
    spyOn(api, "get").and.returnValue(Promise.resolve({ data: vendedor })); // GET /auth/perfil

    vista = montarEnRuta(aplicacion(), "/admin/usuarios");
    await esperar();

    expect(vista.texto()).toContain("Acceso denegado");
    expect(vista.texto()).not.toContain("Mantenedor de usuarios");
  });

  it("permite el acceso al ADMIN después de validar la sesión con el backend", async () => {
    guardarSesion({ accessToken: tokenQueVenceEn(600), refreshToken: "r", usuario: admin });
    spyOn(api, "get").and.returnValue(Promise.resolve({ data: admin }));

    vista = montarEnRuta(aplicacion(), "/admin/usuarios");
    await esperar();

    expect(api.get).toHaveBeenCalledWith("/auth/perfil");
    expect(vista.texto()).toContain("Mantenedor de usuarios");
  });
});
