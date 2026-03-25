"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import  Modalpastel from "@/app/pasteles/modalpastel"
import  styles  from "@/app/pasteles/page.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

<style>
/* Reemplaza tu import actual por este */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Pacifico&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
</style>


type Pastel = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  estado: boolean;
};

// 🔹 Función para traer los pasteles desde la base de datos
async function obtenerPasteles() {
  const { data, error } = await supabase
    .from("pasteles") // 👉 nombre de la tabla
    .select("*")      // 👉 trae todos los campos
    .eq("activo", true); // 👉 solo los activos

  if (error) {
    console.error("Error no hay datos", error);
    return [];
  }

  return data; // 👉 devuelve los datos
}


// 🔹 Componente principal (la página)
export default function Page() {

  const [pasteles, setPasteles] = useState<any[]>([]);
 
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js" as any); // cargamos bootstrap para el modal de la ventana 
  }, []);

  function abrirModal() {
    const modal = document.getElementById("modalPastel"); //aplicamos la funcion a el elemento a abrir 
    
    if (modal) {
      const bsModal = new (window as any).bootstrap.Modal(modal);
      bsModal.show();
    }
  }

  //const [mostrarModal, setMostrarModal] = useState(false);

  // 🔹 Se ejecuta cuando carga la página
  useEffect(() => {
    async function cargar() {
      const data = await obtenerPasteles(); // 👉 llama la función

      console.log("DATOS 👉", data); // 👈 DEBUG

      setPasteles(data); // 👉 guarda los datos en el estado
    }

    cargar();
  }, []);

  return (

  /* 1. CONTENEDOR DE FONDO: Ocupa todo el ancho */
  <div style={{ backgroundColor: "", width: "100%", padding: "40px 0" }}>
    
    {/* 2. CONTENEDOR DE CONTENIDO: Limita el ancho y centra las cosas */}
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 10px" }}>
      
      <h1 style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          fontFamily: "'Montserrat', sans-serif",
          marginBottom: "10px" // Espacio bajo el título
      }}>
        Nuestra Lista de Pasteles
      </h1>

      <p style={{ textAlign: "center", marginBottom: "30px" }}>
        Escoge el que te guste oh personalizalo para cada ocasion a tu medida tu eliges:
      </p>

      <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
      }}>
        {pasteles.map((p) => (
  <div
    key={p.id}
    className={styles.card} // 👈 Mantenemos la clase original para el hover con el mouse en las cards
    style={{
      border: "1px solid #c82323",
      padding: "15px",
      borderRadius: "10px",
      cursor: "pointer" 
    }}
  >
    <h2 style={{ display: "flex", justifyContent: "center", fontSize: "1.2rem" }}>
      {p.nombre}
    </h2>

    <img
      src={p.imagen_url}
      style={{ 
        width: "100%", 
        height: "200px", 
        borderRadius: "10px", 
        objectFit: "cover" 
      }}
      alt={p.nombre}
    />

    <p style={{ marginTop: "10px",
      display: "flex", 
      justifyContent: "center", 
     }}>{p.descripcion}</p>
  </div>
))}
      </div>

      {/* Sección Hero dentro del mismo flujo o fuera si quieres otro color */}
      <section className="hero" style={{ marginTop: "50px" }}>
        <div className="container text-center">
          <h1 className="hero-title" style={{ fontFamily: "'Roboto', sans-serif" }}>
            🎂 Personaliza tu pastel para tus Momentos Especiales
          </h1>
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Personaliza tu Pastel
            </button>
          </div>
        </div>
      </section>

    </div> {/* Cierre del contenedor de contenido */}
    
    <Modalpastel />
  </div> /* Cierre del contenedor de fondo */
);
}