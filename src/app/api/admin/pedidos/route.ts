import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 },
      );
    }

    const role = user.app_metadata.role;

    if (role !== "admin") {
      return NextResponse.json(
        { error: "No tienes permisos" },
        { status: 403 },
      );
    }

    const { data, error } = await supabase
      .from("pedidos")
      .select(
        `
        id,
        cantidad,
        estado,
        created_at,
        pasteles(nombre),
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error interno del servidor";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
