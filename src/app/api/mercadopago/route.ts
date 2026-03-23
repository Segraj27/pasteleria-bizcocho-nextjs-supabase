import MercadoPagoConfig, { Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Convertir y asegurar tipos
    const title = String(body.title);
    const price = Number(body.price);
    const quantity = Number(body.quantity);

    const preference = new Preference(client);

    const preferenceData = {
      body: {
        items: [
          {
            title,
            quantity,
            unit_price: price,
            currency_id: "COP",
          },
        ],
      },
    };

    const response = await preference.create(preferenceData as never);

    return Response.json({ id: response.id });
  } catch (error) {
    console.error("ERROR MP:", error);

    return Response.json({ error: "Error creando pago" }, { status: 500 });
  }
}
