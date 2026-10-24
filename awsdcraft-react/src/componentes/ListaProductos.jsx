import TarjetaProducto from "./TarjetaProducto";

export default function ListaProductos({ productos, onAgregar, mensajeVacio = "No hay productos para mostrar." }) {
  if (productos.length === 0) {
    return <p className="text-secondary">{mensajeVacio}</p>;
  }

  return (
    <div className="row g-4" data-testid="lista-productos">
      {productos.map((producto) => (
        <div className="col-12 col-sm-6 col-lg-3" key={producto.id}>
          <TarjetaProducto producto={producto} onAgregar={onAgregar} />
        </div>
      ))}
    </div>
  );
}
