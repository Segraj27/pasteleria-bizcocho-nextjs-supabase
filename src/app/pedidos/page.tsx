"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectPedidos() {
  const router = useRouter();

<<<<<<< HEAD
  const [user, setUser] = useState<User | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  //  FUNCIÓN DE PAGO (MERCADO PAGO)
  const pagar = async () => {
  try {
    const res = await fetch("/api/mercadopago", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Pastel de chocolate",
        price: 20000,
        quantity: 1,
      }),
    });

    if (!res.ok) {
      throw new Error("Error al crear el pago");
    }

    const data = await res.json();

    if (data.init_point) {
      window.location.href = data.init_point;
    } else {
      throw new Error("No llegó init_point");
    }

  } catch (error) {
    console.error("Error en pago:", error);
    alert("Error al procesar el pago");
  }
};

=======
>>>>>>> c978a79d20df70100afc9fedc7efc808c41fd664
  useEffect(() => {
    router.replace("/admin/pedidos");
  }, []);

  return null;
}
