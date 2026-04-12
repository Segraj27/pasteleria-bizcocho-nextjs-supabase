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
    const body = await req.json().catch(() => ({}));

    console.log(" WEBHOOK:", body);

    const paymentId =
      body?.data?.id ||
      body?.id ||
      body?.resource;

    if (!paymentId) {
      return NextResponse.json({ ok: true });
    }

    const payment = new Payment(client);
    const paymentData = await payment.get({ id: paymentId });

    console.log("💳 PAYMENT:", paymentData);

    const status = paymentData.status;
    const pedidoId = paymentData.external_reference;

    if (status === "approved" && pedidoId) {

      // 🟢 1. INSERT PAGOS
      const { error: pagoError } = await supabase
        .from("pagos")
        .insert([
          {
            pedido_id: pedidoId,
            total: paymentData.transaction_amount,
            estado: "pagado",
            metodo: paymentData.payment_method_id,
          },
        ]);

      console.log("💰 PAGO ERROR:", pagoError);

      // 🟢 2. UPDATE PEDIDO
      const { error: pedidoError } = await supabase
        .from("pedidos")
        .update({ estado: "pagado" })
        .eq("id", pedidoId);

      console.log("📦 PEDIDO ERROR:", pedidoError);

      // 🔥 3. INSERT DETALLE_PEDIDO (NUEVO)
      const { error: detalleError } = await supabase
        .from("detalle_pedido")
        .insert([
          {
            pedido_id: pedidoId,
            cantidad: 1, // ⚠️ por defecto (ajustable)
            precio: paymentData.transaction_amount,
          },
        ]);

      console.log("🍰 DETALLE ERROR:", detalleError);
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}