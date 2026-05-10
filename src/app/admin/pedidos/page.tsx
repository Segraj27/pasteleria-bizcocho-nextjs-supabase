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

      setLoading(true);

      // =================================
      // VALIDAR USUARIO
      // =================================

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      // Error autenticación
      if (error) {

        console.error(error);

        setLoading(false);

        return;
      }

      // =================================
      // SI NO HAY USUARIO
      // =================================

      if (!user) {

        setIsChecking(false);

        setLoading(false);

        return;
      }

      // Guardar usuario
      setUser(user);

      // Ya validó sesión
      setIsChecking(false);

      // =================================
      // LLAMAR API PEDIDOS
      // =================================

      const res = await fetch("/api/admin/pedidos", {
        method: "GET",
        credentials: "include",
      });

      // Convertir respuesta JSON
      const data = await res.json();

      // =================================
      // DEBUG
      // =================================

      console.log("PEDIDOS API:", data);

      // =================================
      // CORRECCIÓN IMPORTANTE
      // =================================
      // La API probablemente devuelve:
      //
      // {
      //   pedidos: [...]
      // }
      //
      // Por eso usamos:
      // data.pedidos
      // =================================

      setPedidos(data.pedidos || []);

      setLoading(false);
    };

    initPage();

  }, []);

  // =================================
  // CAMBIAR ESTADO PEDIDO
  // =================================

  const cambiarEstado = async (
    id: string,
    estado: string
  ) => {

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
    // CORRECCIÓN:
    // Actualizar correctamente
    // la lista de pedidos.
    // =================================

    setPedidos(data.pedidos || []);
  };

  // =================================
  // LOADING
  // =================================

  if (loading) {

    return (
      <p className="text-center mt-5">
        Cargando pedidos...
      </p>
    );
  }

  // =================================
  // VALIDANDO SESIÓN
  // =================================

  if (isChecking) {
    return null;
  }

  // =================================
  // RENDER
  // =================================

  return (

    <div className="container mt-5">

      {/* =================================
          TÍTULO
      ================================= */}

      <h1 className="text-center mb-4">
        Panel de pedidos
      </h1>

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
              MAP PEDIDOS
          ================================= */}

          {pedidos.map((pedido) => (

            <tr key={pedido.id}>

              {/* ID */}
              <td>
                {pedido.id.slice(0, 8)}
              </td>

              {/* Cantidad */}
              <td>
                {pedido.cantidad}
              </td>

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

                {new Date(
                  pedido.created_at
                ).toLocaleDateString()}

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
                      cambiarEstado(
                        pedido.id,
                        "entregado"
                      )
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
                      cambiarEstado(
                        pedido.id,
                        "cancelado"
                      )
                    }
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