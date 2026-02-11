"use client";

import { useEffect } from "react";
import PastelCard from "@/components/PastelCard";

export default function HomePage() {
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container text-center">
          <h1 className="hero-title">
            🎂 Pasteles personalizados para tus Momentos Especiales
          </h1>

          <p className="hero-subtitle">
            En <strong>Pastelería El Bizcocho</strong> creamos pasteles únicos,
            hechos a mano, con amor y los mejores ingredientes.
          </p>

          <div className="hero-actions">
            <a href="/pedidos" className="btn btn-cta btn-lg">
              <i className="bi bi-cake2 me-2"></i>
              Hacer mi pedido
            </a>
          </div>
        </div>
      </section>

      {/* PASTELES */}
      <section className="pasteles">
        <div className="container">
          <h2 className="section-title text-center mb-5">
            Nuestros pasteles más pedidos
          </h2>

          <div className="row g-4">
            <div className="col-md-4 fade-in">
              <PastelCard
                titulo="Pastel de Chocolate"
                descripcion="Bizcocho húmedo de chocolate con relleno de ganache."
                imagen="/images/pastel-chocolate.jpg"
              />
            </div>

            <div className="col-md-4 fade-in">
              <PastelCard
                titulo="Pastel Red Velvet"
                descripcion="Clásico red velvet con crema de queso suave."
                imagen="/images/pastel-red-velvet.jpg"
              />
            </div>

            <div className="col-md-4 fade-in">
              <PastelCard
                titulo="Pastel de Vainilla"
                descripcion="Vainilla artesanal con frutas frescas."
                imagen="/images/pastel-vainilla.jpg"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
