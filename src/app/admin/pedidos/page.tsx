"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

// Interface de pedidos
interface Pedido {
  id: string;
  cantidad: number;
  estado: string;
  created_at: string;
}

export default function PedidosPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const initPage = async () => {
      setLoading(true);

      // Validar usuario
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      if (!user) {
  setIsChecking(false);
  return;
}

      setUser(user);

      // YA validó → puede renderizar
      setIsChecking(false);

      // Llamar API
      const res = await fetch("/api/admin/pedidos", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      console.log("PEDIDOS API:", data);

      setPedidos(data);
      setLoading(false);
    };

    initPage();
  }, []);

  //  FUNCIÓN CORRECTA
  const cambiarEstado = async (id: string, estado: string) => {
    console.log("CAMBIANDO:", id, estado);

    await fetch(`/api/admin/pedidos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado }),
    });

    // refrescar pedidos
    const res = await fetch("/api/admin/pedidos", {
      credentials: "include",
    });

    const data = await res.json();
    setPedidos(data);
  };

  if (loading) {
    return <p className="text-center mt-5">Cargando pedidos...</p>;
  }

  if (isChecking) {
    return null;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Panel de pedidos</h1>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Cantidad</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.id.slice(0, 8)}</td>

              <td>{pedido.cantidad}</td>

              <td>
                <span
                  className={`badge ${
                    pedido.estado === "pendiente"
                      ? "bg-warning"
                      : pedido.estado === "entregado"
                        ? "bg-success"
                        : "bg-danger"
                  }`}
                >
                  {pedido.estado}
                </span>
              </td>

              <td>{new Date(pedido.created_at).toLocaleDateString()}</td>

              <td>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => cambiarEstado(pedido.id, "entregado")}
                  >
                    Entregar
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => cambiarEstado(pedido.id, "cancelado")}
                  >
                    Cancelar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
