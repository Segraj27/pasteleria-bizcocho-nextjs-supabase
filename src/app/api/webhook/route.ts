import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createClient } from "@supabase/supabase-js";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("WEBHOOK:", body);

    if (body.type === "payment" && body.data?.id) {
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: body.data.id });

      const status = paymentData.status;
      const pedidoId = paymentData.external_reference;

      if (status === "approved") {
        await supabase.from("pagos").insert([
          {
            pedido_id: pedidoId,
            total: paymentData.transaction_amount,
            estado: status,
            metodo: paymentData.payment_method_id,
          },
        ]);

        await supabase
          .from("pedidos")
          .update({ estado: "pagado" })
          .eq("id", pedidoId);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error webhook:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
