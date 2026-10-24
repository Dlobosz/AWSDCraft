import { formatearPrecio } from "../utilidades/formato";
import ControlCantidad from "./ControlCantidad";

export default function TablaCarrito({ items, editable = true, onCambiarCantidad, onQuitar }) {
  return (
    <div className="table-responsive">
      <table className="table admin-table align-middle mb-0">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            {editable && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <img src={`/img/${item.imagen}`} alt={item.nombre} className="cart-item-img" />
              </td>
              <td>{item.nombre}</td>
              <td>{formatearPrecio(item.precio)}</td>
              <td>
                {editable ? (
                  <ControlCantidad
                    cantidad={item.cantidad}
                    maximo={item.stock}
                    onCambiar={(valor) => onCambiarCantidad(item.id, valor)}
                  />
                ) : (
                  item.cantidad
                )}
              </td>
              <td>{formatearPrecio(item.precio * item.cantidad)}</td>
              {editable && (
                <td>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onQuitar(item.id)}
                  >
                    Quitar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
