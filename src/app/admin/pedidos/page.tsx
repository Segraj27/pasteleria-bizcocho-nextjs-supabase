"use client";

// =================================
// IMPORTACIONES
// =================================

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

// =================================
// INTERFACE PEDIDOS
// =================================

interface Pedido {
  id: string;
  cantidad: number;
  estado: string;
  created_at: string;
}

// =================================
// COMPONENTE PRINCIPAL
// =================================

export default function PedidosPage() {
  // =================================
  // ROUTER
  // =================================

  const router = useRouter();

  // =================================
  // ESTADOS
  // =================================

  // Usuario autenticado
  const [user, setUser] = useState<User | null>(null);

  // Validación sesión
  const [isChecking, setIsChecking] = useState(true);

  // Lista pedidos
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  // Loading tabla
  const [loading, setLoading] = useState(true);

  // =================================
  // CARGAR PEDIDOS
  // =================================

  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true);

        // =================================
        // VALIDAR USUARIO
        // =================================

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error(error);

          setLoading(false);
          setIsChecking(false);

          return;
        }

        // =================================
        // NO HAY USUARIO
        // =================================

        if (!user) {
          router.push("/login");

          setLoading(false);
          setIsChecking(false);

          return;
        }

        // =================================
        // GUARDAR USER
        // =================================

        setUser(user);

        // =================================
        // OBTENER TOKEN
        // =================================

        const { data: sessionData } = await supabase.auth.getSession();

        const token = sessionData.session?.access_token;

        // =================================
        // FETCH PEDIDOS
        // =================================

        const res = await fetch("/api/admin/pedidos", {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        // =================================
        // DEBUG API
        // =================================

        console.log("PEDIDOS API:", data);

        // =================================
        // CORRECCIÓN:
        // La API devuelve directamente
        // el array de pedidos.
        // =================================

        setPedidos(data || []);

        setIsChecking(false);
        setLoading(false);
      } catch (error) {
        console.error(error);

        setLoading(false);
        setIsChecking(false);
      }
    };

    initPage();
  }, [router]);

  // =================================
  // CAMBIAR ESTADO PEDIDO
  // =================================

  const cambiarEstado = async (id: string, estado: string) => {
    console.log("CAMBIANDO:", id, estado);

    // =================================
    // PATCH API
    // =================================

    await fetch(`/api/admin/pedidos/${id}`, {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ estado }),
    });

    // =================================
    // REFRESCAR PEDIDOS
    // =================================

    const res = await fetch("/api/admin/pedidos", {
      credentials: "include",
    });

    const data = await res.json();

    // =================================
    // DEBUG API
    // =================================

    console.log("DATA API:", data);

    // =================================
    // CORRECCIÓN:
    // La API devuelve directamente
    // el array.
    // =================================

    setPedidos(data || []);
  };

  // =================================
  // LOADING
  // =================================

  if (loading) {
    return <p className="text-center mt-5">Cargando pedidos...</p>;
  }

  // =================================
  // VALIDANDO SESIÓN
  // =================================

  if (isChecking) {
    return null;
  }

  // =================================
  // DEBUG STATE
  // =================================

  console.log("STATE PEDIDOS:", pedidos);

  // =================================
  // RENDER
  // =================================

  return (
    <div className="container mt-5">
      {/* =================================
          TÍTULO
      ================================= */}

      <h1 className="text-center mb-4">Panel de pedidos</h1>

      {/* =================================
          TABLA PEDIDOS
      ================================= */}

      <table className="table table-bordered table-striped">
        {/* =================================
            CABECERA
        ================================= */}

        <thead className="table-dark">
          <tr>
            <th>ID</th>

            <th>Cantidad</th>

            <th>Estado</th>

            <th>Fecha</th>

            <th>Acciones</th>
          </tr>
        </thead>

        {/* =================================
            CUERPO TABLA
        ================================= */}

        <tbody>
          {/* =================================
              VALIDAR SI HAY PEDIDOS
          ================================= */}

          {pedidos.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">
                No hay pedidos registrados
              </td>
            </tr>
          ) : (
            <>
              {/* =================================
                  MAP PEDIDOS
              ================================= */}

              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  {/* ID */}
                  <td>{pedido.id.slice(0, 8)}</td>

                  {/* Cantidad */}
                  <td>{pedido.cantidad}</td>

                  {/* Estado */}
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

                  {/* Fecha */}
                  <td>
                    {new Date(pedido.created_at).toLocaleDateString()}
                  </td>

                  {/* Botones */}
                  <td>
                    <div className="d-flex gap-2">
                      {/* =================================
                          BOTÓN ENTREGAR
                      ================================= */}

                      <button
                        className="btn btn-success btn-sm"
                        onClick={() =>
                          cambiarEstado(pedido.id, "entregado")
                        }
                      >
                        Entregar
                      </button>

                      {/* =================================
                          BOTÓN CANCELAR
                      ================================= */}

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          cambiarEstado(pedido.id, "cancelado")
                        }
                      >
                        Cancelar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}