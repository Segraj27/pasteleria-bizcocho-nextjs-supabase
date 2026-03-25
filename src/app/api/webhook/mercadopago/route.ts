import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { supabase } from "@/lib/supabaseClient";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("WEBHOOK RECIBIDO:", body);

    if (body.type === "payment") {
      const paymentId = body.data.id;

      //Consultar pago en Mercado Pago
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: paymentId });

      console.log("PAGO COMPLETO:", paymentData);

      const pedidoId = paymentData.external_reference;

      //Actualizar pedido en Supabase
      if (status === "approved") {
        await supabase
          .from("pedidos")
          .update({ estado: "pagado" })
          .eq("id", pedidoId);

        console.log("Pedido PAGADO:", pedidoId);
      } else {
        console.log("Pago no aprobado:", status);
      }

      console.log("Pedido actualizado:", pedidoId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error en webhook:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
