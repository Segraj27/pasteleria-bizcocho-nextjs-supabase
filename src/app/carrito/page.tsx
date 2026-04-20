"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

import styles from "./carrito.module.css";

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
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>🛒 Tus Pedidos</h1>
        <button className={styles.btnHistory} onClick={() => router.push("/historial")}>
          📦 Historial de pedidos
        </button>
      </header>

      {cart.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">Tu carrito está vacío.</p>
          <button className="btn btn-dark rounded-pill px-4" onClick={() => router.push("/pasteles")}>
            Explorar Pasteles
          </button>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className={styles.premiumCard}>
              <div className={styles.imageContainer}>
              <img src={ item.imagen || "/placeholder-cake.jpg"} alt={item.nombre} />
              </div>

              <div className={styles.infoContainer}>
                <div className="d-flex justify-content-between align-items-start">
                  <h3 className={styles.productTitle}>{item.nombre}</h3>
                  <button className={styles.btnRemove} onClick={() => removeFromCart(item.id)}>
                    ✕
                  </button>
                </div>
                
                <div className={styles.detailsGrid}>
                  <span><strong>Tamaño:</strong> {item.personalizacion.tamaño}</span>
                  <span><strong>Ocasión:</strong> {item.personalizacion.ocasion}</span>
                  <span><strong>Cant:</strong> {item.cantidad}</span>
                </div>

                <div className={styles.price}>
                  ${(item.precio * item.cantidad).toLocaleString()} COP
                </div>
              </div>
            </div>
          ))}

          <div className={styles.checkoutSummary}>
            <div className="d-flex justify-content-between align-items-end">
              <div>
                <h4 className={styles.totalAmount}>${total.toLocaleString()} cop</h4>
              </div>
              <div className="d-flex align-items-center gap-4">
                <button className={styles.btnClear} onClick={clearCart}>
                  Vaciar carrito
                </button>
                <button className={styles.btnPay} onClick={pagar}>
                  Proceder al pago
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}