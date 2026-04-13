"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Carrito() {
  const { cart, removeFromCart, clearCart } = useCart();

  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    document.body.classList.remove("modal-open");
    document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
  }, []);

  // VERIFICACIÓN DE USUARIO
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUser(user);
    };

    getUser();
  }, [router]);

  const total = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  // 💳 FUNCIÓN MERCADO PAGO
  const pagar = async () => {
    try {
      const res = await fetch("/api/mercadopago", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            title: item.nombre,
            price: item.precio,
            quantity: item.cantidad,
          })),
        }),
      });

      const result = await res.json();

      if (result.init_point) {
        window.location.href = result.init_point;
      } else {
        console.error("Respuesta inválida Mercado Pago:", result);
        alert("No se pudo crear el pago");
      }
    } catch (error) {
      console.error("Error en pago:", error);
      alert("Error al procesar el pago");
    }
  };

  return (
    <div className="container mt-5" style={{paddingTop:"50px"}}>
      <h1 className="mb-4">🛒 Tu carrito</h1>

      {/* BOTÓN HISTORIAL SIEMPRE VISIBLE */}
      <div className="mb-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => router.push("/historial")}
        >
          📦 Ver historial de compras
        </button>
      </div>

      {cart.length === 0 ? (
        <p>No hay productos en el carrito</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              className="card mb-3 p-3 shadow-sm d-flex flex-row justify-content-between align-items-center"
            >
              <div>
                <h5>{item.nombre}</h5>
                <p className="mb-1">Tamaño: {item.personalizacion.tamaño}</p>
                <p className="mb-1">Ocasión: {item.personalizacion.ocasion}</p>
                <p className="mb-1">Cantidad: {item.cantidad}</p>
                <p className="fw-bold">
                  ${item.precio * item.cantidad} COP
                </p>
              </div>

              <button
                className="btn btn-danger"
                onClick={() => removeFromCart(item.id)}
              >
                ❌
              </button>
            </div>
          ))}

          <h3 className="mt-4">Total: ${total} COP</h3>

          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-success" onClick={pagar}>
              Pagar
            </button>

            <button className="btn btn-outline-danger" onClick={clearCart}>
              Vaciar carrito
            </button>
          </div>
        </>
      )}
    </div>
  );
}