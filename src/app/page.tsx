"use client";

import { useEffect } from "react";
import PastelCard from "@/components/PastelCard";
import Footer from "@/components/Footer";
import styles from "@/app/page.module.css"; 

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

  // =================================
  // LISTA PASTELES
  // =================================

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

    // =================================
    // CONTENEDOR PRINCIPAL
    // =================================

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
      }}
    >

      {/* =================================
          WRAPPER CONTENIDO
      ================================= */}

      <div
        className={styles.mainGrid}
        style={{ flex: 1 }}
      >

        <main>

          {/* =================================
              HERO
          ================================= */}

          <section
            className="hero"
            style={{
              paddingTop: "75px",
              paddingBottom: "50px"
            }}
          >

            <div
              className="container text-center"
            >

              {/* =================================
                  TÍTULO HERO
              ================================= */}

              <h1 style={{ paddingTop: "45px"}}>

                <span
                  className="hero-title"
                  style={{
                    display: "block",
                    marginLeft: "-260px"
                  }}
                >
                  🧁"Pasteles Personalizados
                </span>

                <span
                  className="hero-title"
                  style={{
                    display: "block",
                    marginLeft: "30px"
                  }}
                >
                  para tus Momentos
                </span>

                <span
                  className="hero-title"
                  style={{
                    display: "block",
                    marginLeft: "380px"
                  }}
                >
                  Especiales" 🍩
                </span>

              </h1>

              {/* =================================
                  SUBTÍTULO
              ================================= */}

              <p className="hero-subtitle">

                En <strong>Pastelería El Bizcocho</strong>
                creamos pasteles únicos,
                hechos a mano,
                con amor y los mejores ingredientes.

              </p>

              {/* =================================
                  BOTÓN ELIMINADO
              =================================
              Se eliminó:
              "Hacer mi pedido"
              para que ya no aparezca.
              ================================= */}

            </div>
          </section>

          {/* =================================
              SECCIÓN PASTELES
          ================================= */}

          <section className="pasteles">

            <div className="container">

              <h2 className="section-title text-center mb-5">

                Nuestros pasteles más pedidos🥮

              </h2>

              {/* =================================
                  GRID CARDS
              ================================= */}

              <div className="row g-4">

                {pasteles.map((pastel) => (

                  <div
                    key={pastel.id}
                    className="col-md-4 fade-in"
                  >

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

      {/* =================================
          FOOTER
      ================================= */}

      {/* <Footer /> */}

    </div>
  );
}