import MercadoPagoConfig, { Preference } from "mercadopago";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// 🔑 Configuración del cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    // 🍪 Obtener cookies para autenticación en servidor
    const cookieStore = await cookies();

    // 🔐 Crear cliente de Supabase en el servidor
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
           set() {},
           remove() {},
        },
      }
    );

    // 👤 Obtener usuario autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // ❌ Si no hay usuario, bloquea el pago
    if (!user) {
      return Response.json({ error: "No autenticado" }, { status: 401 });
    }

    // 📦 Recibir datos enviados desde el carrito
    const body = await request.json();

    // 🛒 Aquí recibimos el carrito completo
    const { items } = body;

    // ❌ Validación básica
    if (!items || !Array.isArray(items)) {
      return Response.json(
        { error: "Carrito inválido" },
        { status: 400 }
      );
    }

    // 🧾 Crear pedido en Supabase (estado pendiente)
    const { data: pedido, error } = await supabase
      .from("pedidos")
      .insert([
        {
          user_id: user.id,
          estado: "pendiente",
        },
      ])
      .select()
      .single();

    // ❌ Error en base de datos
    if (error) {
      console.error("Error creando pedido:", error);
      return Response.json(
        { error: "Error creando pedido" },
        { status: 500 }
      );
    }

    // 💳 Crear preferencia en Mercado Pago
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        // 🛒 Items del carrito
        items: items.map((item: any) => ({
          title: item.title, // nombre del producto
          unit_price: Number(item.price), // precio unitario
          quantity: Number(item.quantity), // cantidad
          currency_id: "COP", // moneda
        })),

        // 🔗 referencia al pedido en Supabase
        external_reference: pedido.id,

        // 🔁 URLs de retorno después del pago
        back_urls: {
          success:
            "https://pasteleria-bizcocho-nextjs-supabase.vercel.app/checkout/success",
          failure:
            "https://pasteleria-bizcocho-nextjs-supabase.vercel.app/checkout/failure",
          pending:
            "https://pasteleria-bizcocho-nextjs-supabase.vercel.app/checkout/pending",
        },

        // 🔄 redirección automática después del pago aprobado
        auto_return: "approved",

        // 📩 webhook (IMPORTANTE: SIN .ts en la URL)
        notification_url:
          "https://pasteleria-bizcocho-nextjs-supabase.vercel.app/api/webhook",
      },
    } as never);

    // 🚀 RESPUESTA FINAL AL FRONTEND
    return Response.json({
      id: response.id,
      init_point: response.init_point, // 🔥 este es el link de pago
    });
  } catch (error) {
    // ❌ Error general del servidor
    console.error("ERROR MP:", error);

    return Response.json(
      { error: "Error creando pago" },
      { status: 500 }
    );
  }
}