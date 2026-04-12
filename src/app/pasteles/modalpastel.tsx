import { SizeSelector, Size } from "./tamaños/sizepasteles";
import { OccasionSelector, Occasion } from "@/app/pasteles/ocasiones/OccasionSelector";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

type Pastel = {
  nombre?: string;
};

export default function Modalpastel({ pastel }: { pastel: Pastel }) {
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
                  <h4 className="fw-bold mb-4">Personaliza tu pastel</h4>

                  <section className="mb-5">
                    <h6>🎉 1. Ocasión</h6>
                    <OccasionSelector value={occasion} onChange={setOccasion} />
                  </section>

                  <section className="mb-5">
                    <h6>👥 2. Tamaño</h6>
                    <SizeSelector value={size} onChange={setSize} />
                  </section>

                  <section className="mb-5">
                    <h6>🔢 3. Cantidad</h6>
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
                  style={{ backgroundColor: "#FFF5F7" }}
                >
                  <div className="bg-white p-3 mb-4 text-center rounded">
                    <span>🎂</span>
                  </div>

                  <div className="bg-white p-4 flex-grow-1 rounded">
                    <h6>Resumen</h6>

                    <p>Pastel: {pastel?.nombre}</p>
                    <p>Ocasión: {occasion}</p>
                    <p>Tamaño: {size}</p>
                    <p>Cantidad: {cantidad}</p>

                    <h3 style={{ color: "#D81B60" }}>${total} COP</h3>
                  </div>

                  {/* ✔ BOTÓN SIN MERCADO PAGO (SOLO CARRITO) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();

                      if (!pastel) {
                        alert("Selecciona un pastel primero");
                        return;
                      }

                      addToCart({
                        id: crypto.randomUUID(),
                        nombre: pastel.nombre || "Pastel personalizado",
                        precio: precioUnitario,
                        cantidad,
                        personalizacion: {
                          ocasion: occasion,
                          tamaño: size,
                          cantidad,
                        },
                      });

                      router.push("/carrito");
                    }}
                    className="btn w-100 mt-4 py-3 rounded-pill fw-bold shadow-sm"
                    style={{ backgroundColor: "#D81B60", color: "white" }}
                  >
                    Ir a tu Carrito
                  </button>

                  <button
                    type="button"
                    className="btn btn-link mt-2"
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