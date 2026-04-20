"use client";

import { useEffect } from "react";
import PastelCard from "@/components/PastelCard";
import Footer from "@/components/Footer";
import styles from "@/app/page.module.css"; // Asegúrate de tener este módulo para el layout

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

  const pasteles = [
    {
      id: 1,
      titulo: "Pastel de Chocolate",
      descripcion: "Bizcocho húmedo de chocolate con relleno de ganache.",
      imagen: "/images/pastel-chocolate.jpg"
    },
    {
      id: 2,
      titulo: "Pastel Red Velvet",
      descripcion: "Clásico red velvet con crema de queso suave.",
      imagen: "/images/pastel-red-velvet.jpg"
    },
    {
      id: 3,
      titulo: "Pastel de Vainilla",
      descripcion: "Vainilla artesanal con frutas frescas.",
      imagen: "/images/pastel-vainilla.jpg"
    }
  ];

  return (
    /* 1. Contenedor Maestro: Mantiene el Footer al fondo */
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

      {/* 2. Wrapper del Contenido: Aquí manejamos el carrusel lateral */}
      <div className={styles.mainGrid} style={{ flex: 1 }}>

        <main>
          {/* HERO */}
          <section className="hero" style={{ paddingTop: "140px", paddingBottom: "120px" }} >
            <div className="container text-center"  >
              <h1 className="hero-title">
                🎂 Pasteles personalizados 
                <h2 className="hero-title">para tus Momentos </h2>
                  <h3 className="hero-title" style={{paddingBottom: "15px"}}>Especiales 🍩</h3>
              </h1>

              <p className="hero-subtitle">
                En <strong>Pastelería El Bizcocho</strong> creamos pasteles únicos,
                hechos a mano, con amor y los mejores ingredientes.
              </p>

              <div className="hero-actions" style={{display:"flex", justifyContent: "flex-end", paddingRight: "10px"}}>
                <a href="/pasteles" className="btn btn-cta btn-lg">
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
                Nuestros pasteles más pedidos🥮
              </h2>

              <div className="row g-4">
                {/* 2. Mapeamos el array para no repetir con el json de pasteles */}
                {pasteles.map((pastel) => (
                  <div key={pastel.id} className="col-md-4 fade-in">
                    <PastelCard
                      titulo={pastel.titulo}
                      descripcion={pastel.descripcion}
                      imagen={pastel.imagen}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

        </main>

      </div>

    </div>
  );
}