import MercadoPagoConfig, { Preference } from "mercadopago";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      },
    );

    //  Usuario autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "No autenticado" }, { status: 401 });
    }

    // Datos del frontend
    const body = await request.json();

    const title = String(body.title);
    const price = Number(body.price || 0);
    const quantity = Number(body.quantity || 1);

    if (!price || price <= 0) {
      return Response.json({ error: "Precio inválido" }, { status: 400 });
    }

    // Crear pedido en Supabase
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

    if (error || !pedido) {
      console.error("Error creando pedido:", error);
      return Response.json({ error: "Error creando pedido" }, { status: 500 });
    }

    // Crear preferencia
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            id: "producto-1", //
            title: String(title),
            quantity: Number(quantity),
            unit_price: Number(price),
            currency_id: "COP",
          },
        ],
        external_reference: String(pedido.id),
        metadata: {
          user_id: user.id,
        },
        back_urls: {
          success:
            "https://pasteleria-bizcocho-nextjs-supabase.vercel.app/pago-exitoso",
          failure:
            "https://pasteleria-bizcocho-nextjs-supabase.vercel.app/pago-error",
          pending:
            "https://pasteleria-bizcocho-nextjs-supabase.vercel.app/pago-pendiente",
        },
        auto_return: "approved",
        notification_url:
          "https://pasteleria-bizcocho-nextjs-supabase.vercel.app/api/webhook",
      },
    });

    console.log("PREFERENCE RESPONSE:", response);

    return Response.json({
      id: response.id,
      init_point: response.init_point,
    });
  } catch (error) {
    console.error("ERROR MP:", error);

    return Response.json({ error: "Error creando pago" }, { status: 500 });
  }
}
