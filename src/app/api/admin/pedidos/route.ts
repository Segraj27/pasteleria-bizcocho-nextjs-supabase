import { NextResponse } from "next/server";
import { createPedido, getPedidosByUser } from "@/services/pedidos.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { pastel_id, cantidad, mensaje_personalizado } = body;

    // Validación básica
    if (!pastel_id || !cantidad) {
      return NextResponse.json(
        { error: "pastel_id y cantidad son obligatorios" },
        { status: 400 },
      );
    }

    const pedido = await createPedido({
      pastel_id,
      cantidad,
      mensaje_personalizado,
    });

    return NextResponse.json(pedido, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error interno del servidor";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const pedidos = await getPedidosByUser();

    return NextResponse.json(pedidos, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error interno del servidor";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
