const valores = [
  {
    icono: "bi-gem",
    titulo: "Selección cuidada",
    texto: "Probamos cada kit y cada switch antes de sumarlo al catálogo.",
  },
  {
    icono: "bi-people",
    titulo: "Comunidad primero",
    texto: "Escuchamos a la comunidad chilena de entusiastas para decidir qué traer.",
  },
  {
    icono: "bi-wrench-adjustable",
    titulo: "Soporte real",
    texto: "Te ayudamos a elegir piezas compatibles antes y después de la compra.",
  },
];

export default function Nosotros() {
  return (
    <>
      <section className="hero py-5">
        <div className="container py-4 text-center">
          <div className="hero-text-panel mx-auto" style={{ maxWidth: "700px" }}>
            <span className="section-kicker">Nuestra historia</span>
            <h1 className="awsd-title mb-3">Somos AWSDCraft.cl</h1>
            <p className="text-secondary mb-0">
              Nacimos de una obsesión muy simple: el placer de escribir en un buen teclado. Desde
              2026 ayudamos a la comunidad chilena de entusiastas a armar, mejorar y personalizar sus
              propios teclados mecánicos.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <img
              src="/img/kit-65-montaje.jpg"
              alt="Taller de ensamblaje de teclados"
              className="img-fluid rounded-4 border"
            />
          </div>
          <div className="col-lg-6">
            <span className="section-kicker">Qué hacemos</span>
            <h2 className="awsd-title mb-3">De la idea al teclado que sale de tus manos</h2>
            <p className="text-secondary">
              No vendemos teclados genéricos: seleccionamos cada kit, cada set de switches y cada
              keycap pensando en que tú decidas cómo se ve, cómo suena y cómo se siente tu teclado.
            </p>
            <p className="text-secondary">
              Trabajamos directo con la comunidad de entusiastas chilena: escuchamos qué layouts,
              switches y estéticas están de moda, y las traemos antes que nadie.
            </p>
          </div>
        </div>
      </section>

      <section className="container pb-5">
        <div className="row g-3">
          {valores.map((valor) => (
            <div className="col-12 col-md-4" key={valor.titulo}>
              <div className="info-box h-100">
                <i className={`bi ${valor.icono} fs-2 text-awsd-accent`}></i>
                <div>
                  <h3 className="h6 mb-1">{valor.titulo}</h3>
                  <p className="mb-0 small text-secondary">{valor.texto}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
