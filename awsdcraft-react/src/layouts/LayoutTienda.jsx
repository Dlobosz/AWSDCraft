import { Outlet } from "react-router-dom";
import Encabezado from "../componentes/Encabezado";
import PiePagina from "../componentes/PiePagina";

export default function LayoutTienda() {
  return (
    <>
      <Encabezado />
      <main>
        <Outlet />
      </main>
      <PiePagina />
    </>
  );
}
