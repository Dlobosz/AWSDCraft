import { Route, Routes } from "react-router-dom";
import LayoutAdmin from "./layouts/LayoutAdmin";
import LayoutTienda from "./layouts/LayoutTienda";

import BlogDetalle from "./paginas/tienda/BlogDetalle";
import Blogs from "./paginas/tienda/Blogs";
import Carrito from "./paginas/tienda/Carrito";
import CategoriaDetalle from "./paginas/tienda/CategoriaDetalle";
import Categorias from "./paginas/tienda/Categorias";
import Checkout from "./paginas/tienda/Checkout";
import Contacto from "./paginas/tienda/Contacto";
import DetalleProducto from "./paginas/tienda/DetalleProducto";
import Home from "./paginas/tienda/Home";
import Login from "./paginas/tienda/Login";
import NoEncontrada from "./paginas/tienda/NoEncontrada";
import Nosotros from "./paginas/tienda/Nosotros";
import Ofertas from "./paginas/tienda/Ofertas";
import PagoError from "./paginas/tienda/PagoError";
import PagoExitoso from "./paginas/tienda/PagoExitoso";
import Productos from "./paginas/tienda/Productos";
import Registro from "./paginas/tienda/Registro";

import CategoriaForm from "./paginas/admin/CategoriaForm";
import CategoriasListado from "./paginas/admin/CategoriasListado";
import Dashboard from "./paginas/admin/Dashboard";
import OrdenDetalle from "./paginas/admin/OrdenDetalle";
import OrdenesListado from "./paginas/admin/OrdenesListado";
import Perfil from "./paginas/admin/Perfil";
import ProductoForm from "./paginas/admin/ProductoForm";
import ProductoMostrar from "./paginas/admin/ProductoMostrar";
import ProductosCriticos from "./paginas/admin/ProductosCriticos";
import ProductosListado from "./paginas/admin/ProductosListado";
import Reportes from "./paginas/admin/Reportes";
import UsuarioForm from "./paginas/admin/UsuarioForm";
import UsuarioMostrar from "./paginas/admin/UsuarioMostrar";
import UsuariosListado from "./paginas/admin/UsuariosListado";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutTienda />}>
        <Route index element={<Home />} />
        <Route path="productos" element={<Productos />} />
        <Route path="producto/:id" element={<DetalleProducto />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="categorias/:slug" element={<CategoriaDetalle />} />
        <Route path="ofertas" element={<Ofertas />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="pago-exitoso/:id" element={<PagoExitoso />} />
        <Route path="pago-error/:id" element={<PagoError />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:id" element={<BlogDetalle />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>

      <Route path="/admin" element={<LayoutAdmin />}>
        <Route index element={<Dashboard />} />
        <Route path="ordenes" element={<OrdenesListado />} />
        <Route path="ordenes/:id" element={<OrdenDetalle />} />
        <Route path="productos" element={<ProductosListado />} />
        <Route path="productos/nuevo" element={<ProductoForm />} />
        <Route path="productos/:id" element={<ProductoMostrar />} />
        <Route path="productos/:id/editar" element={<ProductoForm />} />
        <Route path="criticos" element={<ProductosCriticos />} />
        <Route path="categorias" element={<CategoriasListado />} />
        <Route path="categorias/nueva" element={<CategoriaForm />} />
        <Route path="categorias/:id/editar" element={<CategoriaForm />} />
        <Route path="usuarios" element={<UsuariosListado />} />
        <Route path="usuarios/nuevo" element={<UsuarioForm />} />
        <Route path="usuarios/:id" element={<UsuarioMostrar />} />
        <Route path="usuarios/:id/editar" element={<UsuarioForm />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>
    </Routes>
  );
}
