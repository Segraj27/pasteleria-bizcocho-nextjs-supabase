"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Modalpastel from "@/app/pasteles/modalpastel"
import styles from "@/app/pasteles/page.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Fuentes: He añadido 'Playfair Display' para ese toque de elegancia en títulos
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Roboto:wght@300;400&display=swap');
`;

async function obtenerPasteles() {
  const { data, error } = await supabase
    .from("pasteles")
    .select("*")
    .eq("activo", true);

  if (error) {
    console.error("Error no hay datos", error);
    return [];
  }
  return data;
}

export default function Page() {
  const [pasteles, setPasteles] = useState<any[]>([]);
 
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js" as any);
  }, []);

  useEffect(() => {
    async function cargar() {
      const data = await obtenerPasteles();
      setPasteles(data);
    }
    cargar();
  }, []);

  return (
    // 1. FONDO: Usamos un tono crema mas suave (#FCF9F6) dandole un 100 de tamaño y espacios en las cards
    <div style={{ backgroundColor: "#FCF9F6", width: "100%", padding: "60px 0", minHeight: "100vh" }}>
      <style>{fontStyles}</style>
      
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        
        <h1 style={{ 
            textAlign: "center",
            fontFamily: "'Playfair Display', serif", // Toque elegante
            color: "#3D2B1F", // Café chocolate oscuro
            fontSize: "3rem",
            marginBottom: "10px"
        }}>
          Nuestra Lista de Pasteles
        </h1>

        <p style={{ 
            textAlign: "center", 
            fontFamily: "'Montserrat', sans-serif",
            color: "#70645C",
            marginBottom: "50px",
            fontSize: "1.1rem"
        }}>
          Elige tu favorito o personalízalo para cada ocasión a tu medida.
        </p>

        {/* GRID DE PASTELES */}
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
        }}>
          {pasteles.map((p) => (
            <div
              key={p.id}
              className={styles.card} 
              style={{
                //backgroundColor: "#ffffff",
                padding: "20px",
                borderRadius: "24px", // Bordes más redondeados
                border: "1px solid #F1E9E4",
                boxShadow: "0 10px 20px rgba(0,0,0,0.03)", // Sombra suave
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              <div style={{ overflow: 'hidden', borderRadius: '18px', marginBottom: '15px' }}>
                <img
                  src={p.imagen_url}
                  style={{ 
                    width: "100%", 
                    height: "250px", 
                    objectFit: "cover",
                    transition: "transform 0.5s ease"
                  }}
                  alt={p.nombre}
                  className={styles.cardImage} // Necesitarás añadir el hover scale en tu CSS
                />
              </div>

              <h2 style={{ 
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.5rem",
                color: "#3D2B1F",
                marginBottom: "10px"
              }}>
                {p.nombre}
              </h2>

              <p style={{ 
                fontFamily: "'Montserrat', sans-serif",
                color: "#8E8279",
                fontSize: "0.95rem",
                lineHeight: "1.5"
              }}>{p.descripcion}</p>
            </div>
          ))}
        </div>

        {/* SECCIÓN HERO / CTA para personalizar el pastel */}
        <section style={{ 
            marginTop: "80px",
            padding: "60px 20px",
            borderRadius: "30px",
            background: "linear-gradient(135deg, #FDF2F2 0%, #FAE3E3 100%)", // Degradado suave
            textAlign: "center"
        }}>
          <h2 style={{ 
              fontFamily: "'Playfair Display', serif", 
              color: "#3D2B1F",
              fontSize: "2.2rem",
              marginBottom: "25px"
          }}>
            🎂 Crea algo único para tus momentos especiales
          </h2>
          
          <button
            type="button"
            className="btn"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            style={{ 
              backgroundColor: "#8B5E3C", // Color chocolate para que quede homogeneo
              color: "white",
              padding: "12px 35px",
              borderRadius: "50px", // Botón tipo píldora redondeando
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: "600",
              fontSize: "1rem",
              border: "none",
              boxShadow: "0 4px 15px rgba(139, 94, 60, 0.3)"
            }}
          >
            Personalizar mi Pastel
          </button>
        </section>

      </div> 
      <Modalpastel />
    </div> 
  );
}