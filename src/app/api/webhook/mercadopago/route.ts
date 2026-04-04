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

    console.log(" WEBHOOK RECIBIDO:", body);

    // Solo procesar pagos
    if (body.type !== "payment") {
      return NextResponse.json({ ok: true });
    }

    const paymentId = body.data.id;

    const payment = new Payment(client);
    const paymentData = await payment.get({ id: paymentId });

    console.log("PAGO COMPLETO:", paymentData);

    const status = paymentData.status;
    const pedidoId = paymentData.external_reference;

    if (!pedidoId) {
      console.log(" No hay external_reference");
      return NextResponse.json({ ok: true });
    }

    // EVITAR PAGOS DUPLICADOS
    const { data: existingPago } = await supabase
      .from("pagos")
      .select("id")
      .eq("pedido_id", pedidoId)
      .maybeSingle();

    if (existingPago) {
      console.log("Pago ya registrado:", pedidoId);
      return NextResponse.json({ ok: true });
    }

    // SOLO SI ESTÁ APROBADO
    if (status === "approved") {
      const userId = paymentData.metadata?.user_id || null;
      const total = paymentData.transaction_amount;
      const metodo = paymentData.payment_method_id;

      // INSERTAR PAGO
      const { error: pagoError } = await supabase.from("pagos").insert([
        {
          pedido_id: pedidoId,
          user_id: userId,
          total: total,
          estado: status,
          metodo: metodo,
        },
      ]);

      if (pagoError) {
        console.error("❌ Error guardando pago:", pagoError);
        return NextResponse.json({ error: "DB error" }, { status: 500 });
      }

      // ACTUALIZAR PEDIDO
      const { error: pedidoError } = await supabase
        .from("pedidos")
        .update({ estado: "pagado" })
        .eq("id", pedidoId);

      if (pedidoError) {
        console.error("❌ Error actualizando pedido:", pedidoError);
      }

      console.log("✅ Pago guardado correctamente:", pedidoId);
    } else {
      console.log("⏳ Pago no aprobado:", status);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("🔥 Error en webhook:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
