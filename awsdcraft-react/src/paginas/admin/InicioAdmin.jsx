import { Navigate } from "react-router-dom";
import { useSesion } from "../../contexto/SesionContexto";
import Dashboard from "./Dashboard";

/** /admin: el ADMIN ve el Dashboard; el VENDEDOR se envía directo a su listado de productos. */
export default function InicioAdmin() {
  const { puede } = useSesion();
  return puede("dashboard") ? <Dashboard /> : <Navigate to="/admin/productos" replace />;
}
