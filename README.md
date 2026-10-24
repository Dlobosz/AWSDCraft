# AWSDCraft.cl

Tienda online de teclados mecánicos personalizados — kits, teclados armados, keycaps, switches y accesorios.

Proyecto desarrollado para la **Evaluación Parcial 1** de la asignatura **DSY1104 – Desarrollo Fullstack II** (Duoc UC).

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

> **Nota de seguridad:** esta primera entrega no cuenta con backend, por lo que el login solo valida el **formato** del correo y el largo de la contraseña (4 a 10 caracteres) — no existe una contraseña real asociada a los usuarios administrados. Cualquier contraseña que cumpla ese formato es aceptada. Esto es una simulación suficiente para el alcance de esta evaluación (documentado también en el ERS del proyecto, sección 3.3.2 – Seguridad), y deberá reforzarse con autenticación real del lado del servidor en una etapa posterior del desarrollo.

## Documentación

El detalle completo de requerimientos y la especificación funcional/no funcional del sistema están en los documentos anexos del proyecto:
- Especificación de Requisitos de Software (ERS)
- Planilla de Requerimientos
