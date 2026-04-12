"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Modalpastel from "@/app/pasteles/modalpastel";
import styles from "@/app/pasteles/page.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation"; // 🔥 faltaba

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
  const router = useRouter(); // faltaba

  const [pasteles, setPasteles] = useState<any[]>([]);
  const [pastelSeleccionado, setPastelSeleccionado] = useState<any>(null);

  // 🔥 estos estados faltaban (los usas abajo)
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);


  // ✅ FUNCIÓN DE PAGO 
  
  const pagar = async (data: any) => {
    try {
      const { data: pedido, error } = await supabase
      .from("pedidos")
      .insert([
        {
          user_id: user.id,
          mensaje_personalizado: data.nombre, // puedes cambiarlo si quieres
          estado: "pendiente",
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error("Error creando pedido");
    }
      const res = await fetch("/api/mercadopago", {
        method: "POST",
        credentials: "include", // 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.nombre,
          price: data.precio,
          quantity: data.cantidad,
        }),
      });

      if (!res.ok) {
        throw new Error("Error al crear el pago");
      }

      const result = await res.json(); 

      if (result.init_point) {
        window.location.href = result.init_point;
      } else {
        throw new Error("No llegó init_point");
      }
    } catch (error) { 
      console.error("Error en pago:", error);
      alert("Error al procesar el pago");
    }
  };

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
          <h1
            style={{
              textAlign: "center",
              fontFamily: "'Playfair Display', serif",
              color: "#3D2B1F",
              fontSize: "3rem",
              marginBottom: "10px",
            }}
          >
            Nuestra Lista de Pasteles
          </h1>

          <p
            style={{
              textAlign: "center",
              fontFamily: "'Montserrat', sans-serif",
              color: "#70645C",
              marginBottom: "50px",
              fontSize: "1.1rem",
            }}
          >
            Elige tu favorito o personalízalo para cada ocasión a tu medida selecciona el que mas te gusta.
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
                style={{
                  padding: "20px",
                  borderRadius: "24px",
                  border: "1px solid #F1E9E4",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.03)",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    overflow: "hidden",
                    borderRadius: "18px",
                    marginBottom: "15px",
                  }}
                >
                  <img
                    src={p.imagen_url}
                    style={{
                      width: "100%",
                      height: "250px",
                      objectFit: "cover",
                    }}
                    alt={p.nombre}
                  />
                </div>

                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.5rem",
                    color: "#3D2B1F",
                  }}
                >
                  {p.nombre}
                </h2>

                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    color: "#8E8279",
                  }}
                >
                  {p.descripcion}
                </p>
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

        <Modalpastel pastel={pastelSeleccionado} pagar={pagar} />
      </div>

      <Footer />
    </>
  );
}