"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Modalpastel from "@/app/pasteles/modalpastel";
import styles from "@/app/pasteles/page.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Roboto:wght@300;400&display=swap');
`;

// 📦 Traer pasteles activos desde Supabase
async function obtenerPasteles() {
  const { data, error } = await supabase
    .from("pasteles")
    .select("*")
    .eq("activo", true);

  if (error) {
    console.error("Error no hay datos", error);
    return [];
  }
  return data.map((p) => ({
    ...p,
    precio: p.precio ?? 0, // 👈 asegura que nunca sea undefined
  }));
}

export default function Page() {
  const router = useRouter();

  // 🍰 lista de pasteles
  const [pasteles, setPasteles] = useState<any[]>([]);

  // 🍰 pastel seleccionado para el modal
  const [pastelSeleccionado, setPastelSeleccionado] = useState<any>(null);

  // 🔐 usuario autenticado
  const [user, setUser] = useState<any>(null);

  // 📦 carga inicial
  useEffect(() => {
    const initPage = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // si no hay usuario → login
      if (!user) {
        router.replace("/login");
        return;
      }

      setUser(user);
    };

    initPage();
  }, [router]);

  // 🎨 bootstrap scripts
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js" as any);
  }, []);

  // 🍰 cargar pasteles
  useEffect(() => {
    async function cargar() {
      const data = await obtenerPasteles();
      setPasteles(data);
    }
    cargar();
  }, []);

  return (
    <>
      <div
        style={{
          backgroundColor: "#FCF9F6",
          width: "100%",
          padding: "60px 0",
          minHeight: "100vh",
        }}
      >
        <style>{fontStyles}</style>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          
          {/* 🏷️ TÍTULO */}
          <h1 style={{ textAlign: "center", fontSize: "3rem", color: "#3D2B1F" }}>
            Nuestra Lista de Pasteles
          </h1>

          <p style={{ textAlign: "center", color: "#70645C" }}>
            Elige tu favorito o personalízalo
          </p>

          {/* 🍰 GRID DE PASTELES */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "30px",
            }}
          >
            {pasteles.map((p) => (
              <div
                key={p.id}
                onClick={() => setPastelSeleccionado(p)} // 👉 selecciona pastel
                className={styles.card}
              >
                <img
                  src={p.imagen_url}
                  style={{ width: "100%", height: "250px" }}
                />
                <h2>{p.nombre}</h2>
                <p>{p.descripcion}</p>
              </div>
            ))}
          </div>

          {/* 🍰 TEXTO DE SELECCIÓN */}
          {pastelSeleccionado && (
            <p style={{ marginTop: "20px", textAlign: "center" }}>
              Seleccionaste: <strong>{pastelSeleccionado.nombre}</strong>
            </p>
          )}

          {/* 🎯 BOTÓN ABRIR MODAL */}
          <div className="text-center mt-4">
            <button
              className="btn"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              style={{
                backgroundColor: "#8B5E3C",
                color: "white",
                padding: "12px 35px",
                borderRadius: "50px",
              }}
            >
              Personalizar mi Pastel
            </button>
          </div>
        </div>

        {/*  MODAL (SIN PAGO AQUÍ) */}
        <Modalpastel pastel={pastelSeleccionado} />
      </div>

      <Footer />
    </>
  );
}