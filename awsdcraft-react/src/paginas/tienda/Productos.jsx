import { useMemo, useState } from "react";
import BuscadorProductos from "../../componentes/BuscadorProductos";
import FiltroCategorias from "../../componentes/FiltroCategorias";
import ListaProductos from "../../componentes/ListaProductos";
import MensajeAlerta from "../../componentes/MensajeAlerta";
import { useCarrito } from "../../contexto/CarritoContexto";
import { listarCategorias } from "../../servicios/categoriasServicio";
import { buscarProductos, listarProductos } from "../../servicios/productosServicio";

export default function Productos() {
  const { agregar } = useCarrito();
  const [termino, setTermino] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [orden, setOrden] = useState("nombre");
  const [aviso, setAviso] = useState("");

  const categorias = listarCategorias();
  const todos = listarProductos();

  const visibles = useMemo(() => {
    let resultado = categoria === "todas" ? todos : todos.filter((p) => p.categoria === categoria);
    resultado = buscarProductos(resultado, termino);

    return [...resultado].sort((a, b) => {
      if (orden === "precio-asc") return a.precio - b.precio;
      if (orden === "precio-desc") return b.precio - a.precio;
      return a.nombre.localeCompare(b.nombre);
    });
  }, [todos, categoria, termino, orden]);

  function agregarProducto(producto) {
    agregar(producto, 1);
    setAviso(`"${producto.nombre}" se agregó al carrito.`);
  }

  return (
    <section className="container py-5">
      <span className="section-kicker">Catálogo</span>
      <h1 className="awsd-title mb-4">Todos nuestros productos</h1>

      <div className="row g-3 align-items-center mb-4">
        <div className="col-12 col-lg-5">
          <BuscadorProductos onBuscar={setTermino} />
        </div>
        <div className="col-12 col-lg-3">
          <select
            className="form-select"
            value={orden}
            onChange={(evento) => setOrden(evento.target.value)}
            aria-label="Ordenar productos"
          >
            <option value="nombre">Ordenar por nombre</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
          </select>
        </div>
        <div className="col-12 col-lg-4">
          <FiltroCategorias
            categorias={categorias}
            seleccionada={categoria}
            onSeleccionar={setCategoria}
          />
        </div>
      </div>

      <MensajeAlerta mensaje={aviso} tipo="success" />
      <p className="text-secondary small">{visibles.length} productos encontrados</p>
      <ListaProductos
        productos={visibles}
        onAgregar={agregarProducto}
        mensajeVacio="No encontramos productos con ese filtro."
      />
    </section>
  );
}
