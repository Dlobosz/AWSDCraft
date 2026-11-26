# AWSDCraft.cl — Frontend en React (Evaluación Parcial 3)

Tienda AWSDCraft.cl construida con React + Vite + Bootstrap 5, **integrada con el backend Spring Boot** mediante API REST (Axios) y autenticación JWT.

- Backend (API REST + Swagger): repositorio **[AWSD_Backend](https://github.com/Dlobosz/AWSD_Backend)** → <http://localhost:8090/swagger-ui.html>

## Requisitos

- Node.js 20 o superior
- El backend en ejecución: MySQL levantado y, en la carpeta del backend, `.\mvnw.cmd spring-boot:run`
  (sin MySQL instalado: `.\mvnw.cmd spring-boot:run -D"spring-boot.run.profiles=dev"`, que usa H2 en memoria)

## Instalación y ejecución

```powershell
npm install
copy .env.example .env      # URL de la API (por defecto http://localhost:8090/api/v1)
npm run dev                 # http://localhost:5173
```

```powershell
npm test                    # pruebas con Vitest + Testing Library
npm run test:coverage       # informe de cobertura en coverage/
npm run build               # versión de producción en dist/
```

## Usuarios de prueba

Los crea el backend la primera vez que arranca:

| Correo | Contraseña | Rol | Qué ve en el frontend |
|---|---|---|---|
| diegolobos@gmail.com | Admin123 | Administrador | Tienda + panel completo |
| camila.reyes@duoc.cl | Vende123 | Vendedor | Panel solo con Productos y Órdenes (lista y detalle, sin botones de edición) |
| javier.munoz@gmail.com | Clien123 | Cliente | Solo la tienda y "Mis compras" |

En el checkout, el medio de pago "Tarjeta de prueba (rechazada)" genera una boleta RECHAZADA (sin descontar stock) para demostrar la vista de pago con error.

## Integración con el backend

```
Página (useCarga) → servicio (productosServicio.js…) → api.js (axios + interceptores) → API REST /api/v1 → MySQL
```

| Archivo | Responsabilidad |
|---|---|
| `src/servicios/api.js` | Cliente axios único (`baseURL` desde `.env`, timeout 10 s). Interceptor de petición: agrega `Authorization: Bearer <token>` y renueva el token si está por vencer. Interceptor de respuesta: ante un 401 renueva una vez y repite la petición; si no puede, cierra la sesión. |
| `src/servicios/sesion.js` | Guarda `accessToken`, `refreshToken` y usuario en **sessionStorage**; lee la fecha de vencimiento del JWT. |
| `src/servicios/*Servicio.js` | Una función por endpoint: `listarProductos` → `GET /productos`, `crearOrden` → `POST /boletas`, etc. |
| `src/hooks/useCarga.js` | Carga datos al montar la página y maneja los estados *cargando* y *error*. |
| `src/contexto/SesionContexto.jsx` | Estado global de autenticación: login, registro, logout, validación de la sesión al recargar y reacción a la expiración. |

El carrito sigue en `localStorage` (no es información sensible); al pagar solo se envían **id de producto y cantidad**: el backend calcula precios, valida y descuenta stock.

## Gestión de sesión

1. **Login:** `POST /auth/login` → se guardan los tokens en `sessionStorage`.
2. **Recarga de página (F5):** `SesionContexto` lee la sesión guardada y la valida con `GET /auth/perfil` antes de mostrar las rutas protegidas (mientras tanto muestra "Verificando sesión...").
3. **Renovación:** cuando el access token (15 min) está por vencer o el backend responde 401, `api.js` llama a `POST /auth/refresh` y repite la petición sin que el usuario lo note. Si varias peticiones lo necesitan a la vez, se hace una sola renovación.
4. **Expiración:** si el refresh token ya no es válido se borra la sesión y el usuario ve "Tu sesión expiró" en el login.
5. **Logout:** borra la sesión local y revoca el refresh token en el servidor (`POST /auth/logout`).

Se usa `sessionStorage` porque mantiene la sesión al recargar, pero se elimina al cerrar la pestaña y no se comparte entre pestañas.

## Restricciones de acceso por rol

La matriz de permisos está centralizada en `src/utilidades/permisos.js` y replica las reglas `@PreAuthorize` del backend:

| Permiso | Admin | Vendedor | Cliente |
|---|:-:|:-:|:-:|
| Entrar al panel `/admin` | ✔ | ✔ | ✘ |
| Ver lista y detalle de productos | ✔ | ✔ | ✘ |
| Crear, editar y eliminar productos | ✔ | ✘ | ✘ |
| Ver lista y detalle de órdenes | ✔ | ✔ | ✘ |
| Cambiar estado o eliminar órdenes | ✔ | ✘ | ✘ |
| Dashboard, stock crítico, categorías, usuarios, reportes, perfil | ✔ | ✘ | ✘ |
| Mis compras | ✔ | ✔ | ✔ |

Se aplica en tres niveles:

1. **Rutas** (`src/componentes/RutaProtegida.jsx` en `App.jsx`): sin sesión redirige a `/login` y recuerda la página pedida; con un rol sin permiso muestra "Acceso denegado", aunque la URL se escriba a mano.
2. **Menús** (`LayoutAdmin.jsx`, `Encabezado.jsx`): las opciones sin permiso no se dibujan. El vendedor solo ve "Órdenes" y "Productos"; el cliente no ve "Administración".
3. **Acciones** (botones Nuevo, Editar, Eliminar, Cambiar estado): solo aparecen si `puede(permiso)` es verdadero.

El frontend oculta lo que el rol no puede usar, pero **la seguridad real está en el backend**: aunque alguien manipulara el navegador, la API responde 401 o 403.

## Estructura

| Carpeta | Contenido |
| --- | --- |
| `src/componentes` | Componentes reutilizables (TarjetaProducto, RutaProtegida, EstadoCarga, AccesoDenegado…) |
| `src/paginas/tienda` | Vistas públicas de la tienda, más "Mis compras" |
| `src/paginas/admin` | Vistas del panel administrativo |
| `src/layouts` | Estructura común de tienda y administración |
| `src/contexto` | Estado global de carrito y sesión |
| `src/hooks` | `useCarga` (consumo de API) y `useBoletaCompra` |
| `src/servicios` | Cliente axios, sesión y servicios REST por entidad |
| `src/datos` | Datos estáticos que no viven en el backend (blogs, regiones y comunas) |
| `src/utilidades` | Validaciones, formato, permisos por rol y estados de boleta |
| `src/pruebas` | Pruebas Vitest + Testing Library (73 pruebas): componentes, servicios REST con axios simulado, sesión, permisos, rutas protegidas y formulario de productos |
