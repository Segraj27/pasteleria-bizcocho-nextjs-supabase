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
  const router = useRouter();

  const [pasteles, setPasteles] = useState<any[]>([]);
  const [pastelSeleccionado, setPastelSeleccionado] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);

  // 🔐 VERIFICACIÓN DE USUARIO
  useEffect(() => {
    const initPage = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUser(user);

      const res = await fetch("/api/admin/pedidos", {
        credentials: "include",
      });

      const data = await res.json();
      setPedidos(data);

      setLoading(false);
    };

    initPage();
  }, [router]);

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
          <h1 style={{ textAlign: "center", fontSize: "3rem", color: "#3D2B1F" }}>
            Nuestra Lista de Pasteles
          </h1>

          <p style={{ textAlign: "center", color: "#70645C" }}>
            Elige tu favorito o personalízalo
          </p>

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
                onClick={() => setPastelSeleccionado(p)}
                className={styles.card}
              >
                <img src={p.imagen_url} style={{ width: "100%", height: "250px" }} />
                <h2>{p.nombre}</h2>
                <p>{p.descripcion}</p>
              </div>
            ))}
          </div>

          {pastelSeleccionado && (
            <p style={{ marginTop: "20px", textAlign: "center" }}>
              Seleccionaste: <strong>{pastelSeleccionado.nombre}</strong>
            </p>
          )}

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

        {/* 🔥 MODAL SIN PAGO AQUÍ */}
        <Modalpastel pastel={pastelSeleccionado} />
      </div>

      <Footer />
    </>
  );
}