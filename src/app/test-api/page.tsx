"use client";
import { useState } from "react";

export default function TestApi() {
  const [response, setResponse] = useState(null);

  const crearPedido = async () => {
    const res = await fetch("/api/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pastel_id: "7dcbda4d-aa82-4924-a8c1-2654f029862b",
        cantidad: 2,
        mensaje_personalizado: "Pedido de prueba backend",
      }),
    });

    const data = await res.json();
    setResponse(data);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Probar API Pedidos</h1>
      <button onClick={crearPedido}>Crear Pedido</button>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
}
