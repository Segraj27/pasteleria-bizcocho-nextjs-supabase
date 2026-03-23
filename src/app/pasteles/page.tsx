"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import  Modalpastel from "@/app/pasteles/modalpastel"
import "bootstrap/dist/css/bootstrap.min.css";


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
    <div>
      <h1 style={{ display: "flex", padding: "40px", margin: "0 auto", justifyContent: "center", alignItems: "center", }}>Nuestra Lista de Pasteles</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", // 👈 3 columnas
          gap: "20px", //margenes de espaciado
        }}
      >
        {pasteles.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #c82323",
              padding: "10px",
              borderRadius: "10px",
            }}

            className="card"
          >
            <h2>{p.nombre}</h2>

            <img
              src={p.imagen_url}
              width="100%"
              height="200px"
              style={{ borderRadius: "10px" }}
            />

            <p>{p.descripcion}</p>
            {/*<p><strong>${p.precio}</strong></p>*/}
           
          </div>
        ))}
      </div>

      <section className="hero">
        <div className="container text-center">
          <h1 className="hero-title">
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
    <Modalpastel />
   

  </div>
  );
}