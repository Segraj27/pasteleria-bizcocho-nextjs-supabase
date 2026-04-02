import MercadoPagoConfig, { Preference } from "mercadopago";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    // Crear cliente de Supabase con sesión
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

    // Obtener usuario autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "No autenticado" }, { status: 401 });
    }

    // Obtener datos del frontend
    const body = await request.json();

    const title = String(body.title);
    const price = Number(body.price || 0);
    const quantity = Number(body.quantity || 1);

    if (!price || price <= 0) {
      return Response.json({ error: "Precio inválido" }, { status: 400 });
    }

    console.log("BODY:", body);
    console.log("PRICE:", price);
    console.log("QUANTITY:", quantity);

    // Crear pedido en la BD
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

    if (error) {
      console.error("Error creando pedido:", error);
      return Response.json({ error: "Error creando pedido" }, { status: 500 });
    }

    // Crear preferencia de pago
    const preference = new Preference(client);

    const response = await preference.create({
      metadata: {
        user_id: user.id,
      },
      body: {
        items: [
          {
            title,
            quantity,
            unit_price: price,
            currency_id: "COP",
          },
        ],
        external_reference: pedido.id,
        back_urls: {
          success:
            "https://pasteleria-bizcocho-nextjs-supabase.vercel.app/pago-exitoso",
          failure:
            "https://pasteleria-bizcocho-nextjs-supabase.vercel.app/pago-error",
          pending:
            "https://pasteleria-bizcocho-nextjs-supabase.vercel.app/pago-pendiente",
        },
        auto_return: "approved",
      },
    } as never);

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
