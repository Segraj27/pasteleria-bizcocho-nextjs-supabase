import { createSupabaseServerClient } from "@/lib/supabaseServer";

type PedidoInput = {
  pastel_id: string;
  cantidad: number;
  mensaje_personalizado?: string;
};

export async function createPedido(data: PedidoInput) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Usuario no autenticado");
  }

  const user = session.user;

  const { data: result, error } = await supabase
    .from("pedidos")
    .insert({
      user_id: user.id,
      pastel_id: data.pastel_id,
      cantidad: data.cantidad,
      mensaje_personalizado: data.mensaje_personalizado,
      estado: "pendiente",
      estado_pago: "pending",
    })
    .select()
    .single();

  if (error) throw error;

  return result;
}

export async function getPedidosByUser() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Usuario no autenticado");
  }

  const user = session.user;

  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function deletePedidoById(id: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Usuario no autenticado");
  }

  const user = session.user;

  const { error } = await supabase
    .from("pedidos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;

  return { message: "Pedido eliminado correctamente" };
}
