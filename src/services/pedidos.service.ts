import { createClient } from "@supabase/supabase-js";

type PedidoInput = {
  pastel_id: string;
  cantidad: number;
  mensaje_personalizado?: string;
};

function getSupabaseWithAuth(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

// CREAR PEDIDO
export async function createPedido(data: PedidoInput, token: string) {
  const supabase = getSupabaseWithAuth(token);

  // Obtener usuario correctamente
  const { data: userData, error: userError } = await supabase.auth.getUser();

  console.log("USER DATA:", userData);
  console.log("USER ERROR:", userError);

  const user = userData?.user;

  if (!user) {
    throw new Error("Usuario no autenticado");
  }

  // Insertar pedido
  const { data: result, error: insertError } = await supabase
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

  if (insertError) throw insertError;

  return result;
}

// OBTENER PEDIDOS
export async function getPedidosByUser(token: string) {
  const supabase = getSupabaseWithAuth(token);

  console.log("TOKEN RECIBIDO:", token);

  const { data: userData, error: userError } = await supabase.auth.getUser();

  console.log("USER DATA:", userData);
  console.log("USER ERROR:", userError);

  const user = userData?.user;

  if (!user) {
    throw new Error("Usuario no autenticado");
  }

  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

// ELIMINAR PEDIDO
export async function deletePedidoById(id: string, token: string) {
  const supabase = getSupabaseWithAuth(token);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  console.log("USER:", user);
  console.log("USER ERROR:", userError);

  if (!user) {
    throw new Error("Usuario no autenticado");
  }

  const { error } = await supabase
    .from("pedidos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;

  return { message: "Pedido eliminado correctamente" };
}
