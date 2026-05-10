import { NextResponse } from "next/server";
import { createPedido, getAllPedidos } from "@/services/pedidos.service";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    console.log("AUTH HEADER:", authHeader);

    if (!authHeader) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    const body = await request.json();

    const { pastel_id, cantidad, mensaje_personalizado } = body;

    // Validación básica
    if (!pastel_id || !cantidad) {
      return NextResponse.json(
        { error: "pastel_id y cantidad son obligatorios" },
        { status: 400 },
      );
    }

    const pedido = await createPedido(
      {
        pastel_id,
        cantidad,
        mensaje_personalizado,
      },
      token,
    );

    return NextResponse.json(pedido, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error interno del servidor";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const pedidos = await getAllPedidos();

    return NextResponse.json(pedidos, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error interno del servidor";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
