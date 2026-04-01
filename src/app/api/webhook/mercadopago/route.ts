import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createClient } from "@supabase/supabase-js";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

// Cliente seguro de Supabase (backend)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("WEBHOOK RECIBIDO:", body);

    if (body.type === "payment") {
      const paymentId = body.data.id;

      // Consultar pago en MercadoPago
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: paymentId });

      console.log("PAGO COMPLETO:", paymentData);

      const status = paymentData.status; // ✅ AHORA SÍ EXISTE
      const pedidoId = paymentData.external_reference;

      if (!pedidoId) {
        console.log("No hay external_reference");
        return NextResponse.json({ ok: true });
      }

      // ✅ Si el pago fue aprobado
      if (status === "approved") {
        await supabase
          .from("pedidos")
          .update({ estado: "pagado" })
          .eq("id", pedidoId);

        console.log("Pedido PAGADO:", pedidoId);
      } else {
        console.log("Pago no aprobado:", status);
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Error en webhook:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}