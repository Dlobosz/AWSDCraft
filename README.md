# AWSDCraft.cl

Tienda online de teclados mecánicos personalizados — kits, teclados armados, keycaps, switches y accesorios.

Proyecto semestral de la asignatura **DSY1104 – Desarrollo Fullstack II** (Duoc UC).

## Estado actual (Evaluación Parcial 3)

| Parte | Ubicación | Tecnología |
|---|---|---|
| **Frontend** (versión vigente) | carpeta [`awsdcraft-react/`](awsdcraft-react/README.md) de este repositorio | React 18 + Vite + Axios |
| **Backend** (API REST) | repositorio **[AWSD_Backend](https://github.com/Dlobosz/AWSD_Backend)** | Spring Boot 3.4 + MySQL + JWT |
| Sitio HTML original (Evaluación 1) | raíz de este repositorio (`index.html`, `pages/`, `js/`) | HTML, CSS y JavaScript |

En la Evaluación 3 el frontend React dejó de usar `localStorage` para los datos del negocio: ahora consume la API REST del backend, inicia sesión con JWT, mantiene la sesión al recargar la página y restringe pantallas y acciones según el rol (Administrador, Vendedor, Cliente). Las instrucciones para ejecutarlo están en [`awsdcraft-react/README.md`](awsdcraft-react/README.md).

### Documentos de la entrega (carpeta [`documentos/`](documentos))

| Documento | Contenido |
|---|---|
| `ERS AWSDCraft v3.docx` | Especificación de requisitos actualizada con el backend, la API y la seguridad |
| `Manual de Usuario AWSDCraft.docx` | Instalación, configuración y uso de la tienda y del panel, con pantallazos |
| `Documentación APIs AWSDCraft.xlsx` | Planilla con los 29 endpoints de la API (Anexo 3) |
| `Documentación APIs e Integración AWSDCraft.docx` | Modelo de datos, endpoints, seguridad JWT, integración, pruebas y resultados (Anexo 2) |

---

## Evaluación Parcial 1: sitio en HTML, CSS y JavaScript

El resto de este documento describe la primera versión del proyecto, que se conserva como historial.

## Sobre el proyecto

AWSDCraft.cl simula una tienda online completa, con una parte pública (tienda) y un panel de administración privado para gestionar el catálogo y los usuarios. Está construido únicamente con **HTML5, CSS3 y JavaScript** (sin frameworks de backend), usando **Bootstrap 5.3.8** como base de maquetado y una hoja de estilos propia para la identidad visual de marca.

Como esta primera entrega no incluye backend ni base de datos, toda la información (carrito de compras, catálogo administrado y usuarios administrados) se guarda en el `localStorage` del navegador.

## Tecnologías

- HTML5 semántico
- CSS3 (variables/custom properties) + Bootstrap 5.3.8 + Bootstrap Icons
- JavaScript (vanilla, sin frameworks)
- Google Fonts (Sora e Inter)
- Git / GitHub para control de versiones

## Estructura del proyecto

```
AWSDCraft/
├── index.html                  # Home de la tienda
├── css/
│   └── style.css                # Hoja de estilos única del sitio completo
├── img/                          # Logo, fondo del Home y fotos de producto
├── js/
│   ├── productos-data.js         # Catálogo de productos (arreglo)
│   ├── usuarios-data.js          # Usuarios semilla del panel admin
│   ├── regiones-comunas.js       # Regiones/comunas de Chile (formularios)
│   ├── validadores.js            # Validación de RUN y dominios de correo
│   ├── render-productos.js       # Función compartida para tarjetas de producto
│   ├── carrito.js / carrito-vista.js
│   ├── catalogo.js / detalle-producto.js / home-destacados.js
│   ├── blogs-data.js / blogs.js
│   ├── validaciones-registro.js / validaciones-login.js / validaciones-contacto.js
│   └── admin-*.js                # Lógica del panel de administración
├── pages/                        # Vistas públicas de la tienda
│   ├── productos.html / detalle-producto.html / carrito.html
│   ├── registro.html / login.html
│   ├── nosotros.html / blogs.html / blog-detalle-1.html / blog-detalle-2.html
│   ├── contacto.html
│   └── admin/                    # Panel de administración (privado)
│       ├── home.html                          # Dashboard
│       ├── productos-listado.html / producto-nuevo.html / producto-editar.html / producto-mostrar.html
│       └── usuarios-listado.html / usuario-nuevo.html / usuario-editar.html / usuario-mostrar.html
```

## Funcionalidades principales

**Tienda pública**
- Catálogo de productos filtrable por categoría
- Detalle de producto con productos relacionados
- Carrito de compras (agregar, editar cantidad, eliminar, total) persistido en `localStorage`
- Registro de usuario con validación de RUN chileno (dígito verificador), correo y contraseña
- Inicio de sesión con validación de formato
- Blog, sección Nosotros y formulario de Contacto

**Panel de administración**
- Acceso protegido: solo se puede entrar iniciando sesión con una cuenta de rol **Administrador**
- Dashboard con estadísticas (total de productos, usuarios, alertas de stock crítico)
- Mantenedor de Productos: listar, crear, editar y ver detalle
- Mantenedor de Usuarios: listar, crear, editar y ver detalle

## Acceso al panel de Administrador

El acceso al panel **no está expuesto en ningún link visible del sitio** — se obtiene únicamente iniciando sesión en `pages/login.html`.

El usuario semilla `id: 1` (Diego Lobos Ortiz) está configurado con `tipoUsuario: "Administrador"` en `js/usuarios-data.js`, con el correo `diegolobos@gmail.com`. Al iniciar sesión con ese correo, el sistema redirige automáticamente al Dashboard del panel admin; cualquier otro correo válido ingresa como Cliente a la tienda normal.

