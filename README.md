# AWSDCraft.cl — Frontend (React)

Tienda online de teclados mecánicos. Proyecto semestral de **DSY1104 Desarrollo Fullstack II** (Duoc UC).

- **Frontend** (este repositorio, carpeta `awsdcraft-react/`): React 18 + Vite + Bootstrap + Axios.
- **Backend** (API REST + JWT + MySQL): <https://github.com/Dlobosz/AWSD_Backend>
- **Documentos de la entrega**: carpeta [`documentos/`](documentos) (ERS, manual de usuario, documentación de APIs e integración).

La Evaluación 1 construyó la tienda en HTML/CSS/JS, la Evaluación 2 la llevó a React y la Evaluación 3 la conecta al backend: los datos vienen de la API, el login usa JWT y cada rol ve solo lo que le corresponde.

## Cómo ejecutarlo

Con el backend corriendo en `http://localhost:8090`:

```powershell
cd awsdcraft-react
npm install
copy .env.example .env    # VITE_API_URL=http://localhost:8090/api/v1
npm run dev               # http://localhost:5173
```

Pruebas: `npm test` (Vitest + Testing Library).

## Usuarios de prueba

| Correo | Contraseña | Rol | Qué ve |
|---|---|---|---|
| diegolobos@gmail.com | Admin123 | Administrador | Tienda y panel completo |
| camila.reyes@duoc.cl | Vende123 | Vendedor | Panel con Productos y Órdenes, solo lista y detalle |
| javier.munoz@gmail.com | Clien123 | Cliente | Solo la tienda |

## Dónde está cada requisito de la Evaluación 3

| Requisito | Archivos |
|---|---|
| Comunicación con la API (axios) | `src/servicios/api.js` (cliente axios con el token) y un servicio por recurso: `productosServicio.js`, `ordenesServicio.js`, `usuariosServicio.js`, `categoriasServicio.js`, `authServicio.js` |
| Sesión que se mantiene al recargar | `src/servicios/sesion.js` (tokens en `sessionStorage`) y `src/contexto/SesionContexto.jsx` (al recargar confirma la sesión con `GET /auth/perfil`) |
| Renovación del token | `api.js`: si el backend responde 401, llama a `POST /auth/refresh` y repite la petición |
| Restricciones por rol | `src/utilidades/permisos.js` (qué puede cada rol), `src/componentes/RutaProtegida.jsx` (protege las rutas), `src/layouts/LayoutAdmin.jsx` (menú según el rol) |

## Estructura de `awsdcraft-react/src`

| Carpeta | Contenido |
|---|---|
| `paginas/tienda`, `paginas/admin` | Pantallas de la tienda y del panel |
| `componentes`, `layouts` | Piezas reutilizables y estructura común |
| `contexto` | Estado global: sesión y carrito |
| `servicios` | Cliente axios, sesión y llamadas a la API |
| `hooks` | `useCarga` (carga datos de la API) y `useBoletaCompra` |
| `utilidades` | Permisos por rol, validaciones y formato |
| `datos` | Datos fijos que no están en el backend (blogs, regiones y comunas) |
| `pruebas` | 72 pruebas con Vitest |
