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

    // usuario autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "No autenticado" }, { status: 401 });
    }

    //  datos del frontend
    const body = await request.json();

    const title = String(body.title);
    const price = Number(body.price);
    const quantity = Number(body.quantity);

    // crear pedido
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

    // crear pago
    const preference = new Preference(client);

    const response = await preference.create({
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
            "https://pasteleria-bizcocho-nextjs-supabase.vercel.app/checkout/success",
          failure:
            "https://pasteleria-bizcocho-nextjs-supabase.vercel.app/checkout/failure",
          pending:
            "https://pasteleria-bizcocho-nextjs-supabase.vercel.app/checkout/pending",
        },
        auto_return: "approved",
      },
    } as never);

    return Response.json({
      id: response.id,
      init_point: response.init_point,
    });
  } catch (error) {
    console.error("ERROR MP:", error);

    return Response.json({ error: "Error creando pago" }, { status: 500 });
  }
}
