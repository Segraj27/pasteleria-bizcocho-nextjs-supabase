import { NextResponse } from "next/server";
import { deletePedidoById } from "@/services/pedidos.service";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

// ================= DELETE =================
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const result = await deletePedidoById(id);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error interno del servidor";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ================= PATCH =================
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    console.log("ID QUE LLEGA:", id);

    const body = await request.json();
    const { estado } = body;

    if (!estado) {
      return NextResponse.json(
        { error: "El estado es obligatorio" },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 },
      );
    }

    const role = session.user.app_metadata.role;

    if (role !== "admin") {
      return NextResponse.json(
        { error: "No tienes permisos para actualizar el estado" },
        { status: 403 },
      );
    }

    const { data, error } = await supabase
      .from("pedidos")
      .update({ estado })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.log("SUPABASE ERROR:", error);
      throw error;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error interno del servidor";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
