import { SizeSelector, Size } from "./tamaños/sizepasteles";
import {
  OccasionSelector,
  Occasion,
} from "@/app/pasteles/ocasiones/OccasionSelector";

import { useState } from "react";

export default function Modalpastel() {
  const [size, setSize] = useState<Size>("Pequeño");
  const [occasion, setOccasion] = useState<Occasion>("Otro");

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
                {/* COLUMNA IZQUIERDA: Configuración (Blanca) */}
                <div className="col-12 col-lg-8 p-4 p-lg-5 ">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4
                      style={{
                        fontFamily: "'Quicksand', sans-serif",
                        fontWeight: 700,
                        color: "#340101",
                      }}
                    >
                      Personaliza tu pastel
                    </h4>
                    {/* Botón de cerrar personalizado */}
                    <button
                      type="button"
                      className="btn-close d-md-none"
                      data-bs-dismiss="modal"
                    ></button>
                  </div>

                  {/* 1. SECCIÓN OCASIÓN */}
                  <section className="mb-5">
                    <h6 className="fw-bold mb-3">🎉 1. ¿Cuál es la ocasión?</h6>
                    <OccasionSelector value={occasion} onChange={setOccasion} />
                  </section>

                  {/* 2. SECCIÓN TAMAÑO */}
                  <section className="mb-5">
                    <h6 className="fw-bold ">👥 2. Selecciona el tamaño</h6>
                    <SizeSelector value={size} onChange={setSize} />
                  </section>

                  {/* 3. SECCIÓN SABOR */}
                  <section>
                    <h6 className="fw-bold mb-3">
                      🍰 3. Elige el sabor de la masa
                    </h6>
                    {/* Tu componente de sabores */}
                  </section>
                </div>

                {/*--------------------------------------------------------------------------------------------------------------------------------------- */}

                {/* COLUMNA DERECHA: Resumen (Fondo Rosado/Crema) */}
                {/* Resumen del Pedido de Pasteles */}
                <div
                  className="col-12 col-lg-4 p-4 d-flex flex-column shadow-sm"
                  style={{ backgroundColor: "#FFF5F7", minHeight: "100%" }}
                >
                  {/* Vista Previa */}
                  <div className="bg-white rounded-4 p-3 mb-4 shadow-sm text-center">
                    <span
                      className="badge rounded-pill mb-2"
                      style={{ backgroundColor: "#FFD1DC", color: "#D81B60" }}
                    >
                      Vista Previa
                    </span>
                    <div className="py-4">
                      {/* Aquí va la imagen del pastel */}
                      <span style={{ fontSize: "80px" }}>🎂</span>
                    </div>
                  </div>

                  {/* Resumen de pedido */}
                  <div className="bg-white rounded-4 p-4 shadow-sm flex-grow-1">
                    <h6 className="fw-bold mb-4">📋 Resumen de tu pedido</h6>

                    {/* Fila de Ocasión */}
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                      <span className="text-muted small">Ocasión</span>
                      <span
                        className="fw-bold text-end"
                        style={{ color: "#340101" }}
                      >
                        {occasion}
                      </span>
                    </div>

                    {/* Fila de Tamaño */}
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                      <span className="text-muted small">Tamaño</span>
                      <span
                        className="fw-bold text-end"
                        style={{ color: "#340101" }}
                      >
                        {size}
                      </span>
                    </div>
                    {/* aquí se añade más filas de resumen de lógica */}

                    <div className="mt-5 pt-3 border-top text-center">
                      <p className="text-muted mb-0 small">Precio Estimado</p>
                      <h2 className="fw-bold" style={{ color: "#D81B60" }}>
                        $350 <small className="h6">COP</small>
                      </h2>
                    </div>
                  </div>

                  {/* Botón de Acción Principal */}
                  <button
                    className="btn w-100 mt-4 py-3 rounded-pill fw-bold shadow-sm"
                    style={{ backgroundColor: "#D81B60", color: "white" }}
                  >
                    Completa tu diseño
                  </button>

                  <button
                    type="button"
                    className="btn btn-link btn-sm text-muted mt-2"
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
