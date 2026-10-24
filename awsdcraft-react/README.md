# AWSDCraft.cl — Frontend en React (Evaluación Parcial 2)

Migración de la tienda AWSDCraft.cl desde HTML/CSS/JS a React con Vite, Bootstrap 5 y
pruebas unitarias con Jasmine + Karma.

## Instalación

```
npm install
```

## Ejecutar la aplicación

```
npm run dev
```

La aplicación queda disponible en http://localhost:5173

## Ejecutar las pruebas unitarias

```
npm test
```

El reporte de cobertura se genera en la carpeta `coverage/`.

## Estructura

| Carpeta | Contenido |
| --- | --- |
| `src/componentes` | Componentes reutilizables (Boton, TarjetaProducto, ListaProductos, etc.) |
| `src/paginas/tienda` | Vistas públicas de la tienda |
| `src/paginas/admin` | Vistas del panel administrativo |
| `src/layouts` | Estructura común de tienda y administración |
| `src/contexto` | Estado global de carrito y sesión |
| `src/servicios` | Operaciones CRUD y persistencia en localStorage |
| `src/datos` | Archivos de datos simulados (productos, usuarios, categorías, blogs, regiones) |
| `src/utilidades` | Validaciones y funciones de formato |
| `src/pruebas` | Especificaciones Jasmine |

## Usuarios de prueba

| Correo | Tipo | Contraseña |
| --- | --- | --- |
| diegolobos@gmail.com | Administrador | cualquiera de 4 a 10 caracteres |
| camila.reyes@duoc.cl | Vendedor | cualquiera de 4 a 10 caracteres |
| javier.munoz@gmail.com | Cliente | cualquiera de 4 a 10 caracteres |

En el checkout, la opción de pago "Tarjeta de prueba (rechazada)" permite demostrar la vista
de pago con error.
