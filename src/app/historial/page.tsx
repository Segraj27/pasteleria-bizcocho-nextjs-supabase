"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Historial() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const router = useRouter();

  //  VERIFICAR USUARIO
  useEffect(() => {
    const getPedidos = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      //  si no está logueado, lo manda a login
      if (!user) {
        router.replace("/login");
        return;
      }

      // 📦 traer historial de pedidos del usuario
      const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error cargando historial:", error);
        return;
      }

      setPedidos(data || []);
    };

    getPedidos();
  }, [router]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">📦 Historial de compras</h1>

      {/*  sin pedidos */}
      {pedidos.length === 0 ? (
        <p>No tienes compras registradas</p>
      ) : (
        pedidos.map((pedido) => (
          <div
            key={pedido.id}
            className="card mb-3 p-3 shadow-sm"
          >
            {/*  ID */}
            <h5>Pedido #{pedido.id}</h5>

            {/*  ESTADO */}
            <p>
              Estado:{" "}
              <strong
                style={{
                  color:
                    pedido.estado === "pagado"
                      ? "green"
                      : pedido.estado === "pendiente"
                      ? "orange"
                      : "red",
                }}
              >
                {pedido.estado}
              </strong>
            </p>

            {/*  FECHA */}
            <p>
              Fecha:{" "}
              {pedido.created_at
                ? new Date(pedido.created_at).toLocaleString()
                : "Sin fecha"}
            </p>

            {/*  TOTAL */}
            <p>Total: ${pedido.total || 0} COP</p>

            {/* PRODUCTOS */}
            <details>
              <summary>Ver productos</summary>

              <div style={{ marginTop: "10px" }}>
                {pedido.items ? (
                  JSON.parse(pedido.items).map(
                    (item: any, index: number) => (
                      <div key={index}>
                        🍰 {item.title} x{item.quantity}
                      </div>
                    )
                  )
                ) : (
                  <p>No hay productos</p>
                )}
              </div>
            </details>
          </div>
        ))
      )}
    </div>
  );
}