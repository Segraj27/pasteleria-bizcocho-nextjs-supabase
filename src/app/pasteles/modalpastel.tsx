import { SizeSelector, Size } from "./tamaños/sizepasteles";
import { OccasionSelector, Occasion } from "@/app/pasteles/ocasiones/OccasionSelector";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

// 📦 Ajuste del tipo para incluir imagen_url
type Pastel = {
  id?: string | number; 
  nombre: string;
  precio?: number;
  imagen_url?: string; 
};

type Props = {
  pastel: Pastel;
};

export default function Modalpastel({ pastel }: Props) {
  const [size, setSize] = useState<Size>("Pequeño");
  const [occasion, setOccasion] = useState<Occasion>("Otro");
  const [cantidad, setCantidad] = useState(1);

  const { addToCart } = useCart();
  const router = useRouter();

  const precioUnitario =
    size === "Pequeño"
      ? 30000
      : size === "Mediano"
      ? 50000
      : size === "Grande"
      ? 80000
      : 30000;

  const total = precioUnitario * cantidad;

  return (
    <div className="modal fade" id="exampleModal" tabIndex={-1}>
      <div
        className="modal-dialog modal-xl modal-dialog-centered"
        style={{ maxWidth: "950px", width: "90%" }}
      >
        <div
          className="modal-content"
          style={{ borderRadius: "20px", overflow: "hidden", border: "none" }}
        >
          <div className="modal-body p-0">
            <div className="container-fluid">
              <div className="row">

                {/* IZQUIERDA */}
                <div className="col-12 col-lg-8 p-4 p-lg-5">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: "#340101" }}>
                      Personaliza tu pastel
                    </h4>
                    <button type="button" className="btn-close d-md-none" data-bs-dismiss="modal" />
                  </div>

                  <section className="mb-5">
                    <h6 className="fw-bold mb-3">🎉 1. ¿Cuál es la ocasión?</h6>
                    <OccasionSelector value={occasion} onChange={setOccasion} />
                  </section>

                  <section className="mb-5">
                    <h6 className="fw-bold">👥 2. Selecciona el tamaño</h6>
                    <SizeSelector value={size} onChange={setSize} />
                  </section>

                  <section className="mb-5">
                    <h6 className="fw-bold mb-3">🔢 3. Cantidad</h6>
                    <input
                      type="number"
                      min="1"
                      value={cantidad}
                      onChange={(e) => setCantidad(Number(e.target.value))}
                      className="form-control"
                      style={{ maxWidth: "120px" }}
                    />
                  </section>
                </div>

                {/* DERECHA */}
                <div
                  className="col-12 col-lg-4 p-4 d-flex flex-column shadow-sm"
                  style={{ backgroundColor: "#FFF5F7", minHeight: "100%" }}
                >
                  <div className="bg-white rounded-4 p-3 mb-4 shadow-sm text-center">
                    <span className="badge rounded-pill mb-2" style={{ backgroundColor: "#FFD1DC", color: "#D81B60" }}>
                      Vista Previa
                    </span>
                    <div className="py-4">
                      <span style={{ fontSize: "80px" }}>🎂</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-4 p-4 shadow-sm flex-grow-1">
                    <h6 className="fw-bold mb-4">📋 Resumen de tu pedido</h6>
                    <div className="d-flex justify-content-between border-bottom pb-2">
                      <span className="text-muted small">Pastel</span>
                      <span className="fw-bold">{pastel?.nombre}</span>
                    </div>
                    <div className="d-flex justify-content-between border-bottom pb-2 mt-2">
                      <span className="text-muted small">Ocasión</span>
                      <span className="fw-bold">{occasion}</span>
                    </div>
                    <div className="d-flex justify-content-between border-bottom pb-2 mt-2">
                      <span className="text-muted small">Tamaño</span>
                      <span className="fw-bold">{size}</span>
                    </div>
                    <div className="d-flex justify-content-between border-bottom pb-2 mt-2">
                      <span className="text-muted small">Cantidad</span>
                      <span className="fw-bold">{cantidad}</span>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-muted small mb-0">Precio Estimado</p>
                      <h2 style={{ color: "#D81B60" }} className="fw-bold">
                        ${total} COP
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!pastel) return;

                      addToCart({
                        id: pastel.id || crypto.randomUUID(),
                        nombre: pastel.nombre,
                        precio: precioUnitario,
                        cantidad: cantidad,
                        imagen: pastel.imagen_url, // se añade la imagen al carrito
                        personalizacion: {
                          ocasion: occasion,
                          tamaño: size,
                        },
                      });

                      router.push("/carrito");
                    }}
                    className="btn w-100 mt-4 py-3 rounded-pill fw-bold shadow-sm"
                    style={{ backgroundColor: "#D81B60", color: "white" }}
                  >
                    Ir al Carrito
                  </button>

                  <button
                    type="button"
                    className="btn btn-link mt-2 text-decoration-none text-muted"
                    data-bs-dismiss="modal"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}