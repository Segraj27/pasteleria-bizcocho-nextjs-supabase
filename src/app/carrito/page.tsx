"use client";

import { useCart } from "@/context/CartContext";
import { useEffect } from "react";

export default function Carrito() {
  const { cart, removeFromCart, clearCart } = useCart();

  useEffect(() => {
    document.body.classList.remove("modal-open");

    document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
  }, []);

  const total = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  return (
    <div className="container mt-5">
      <h1 className="mb-4">🛒 Tu carrito</h1>

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
                <p className="fw-bold">${item.precio * item.cantidad} COP</p>
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
            <button className="btn btn-success">Pagar</button>

            <button className="btn btn-outline-danger" onClick={clearCart}>
              Vaciar carrito
            </button>
          </div>
        </>
      )}
    </div>
  );
}
