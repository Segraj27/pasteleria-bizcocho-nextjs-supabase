import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST() {
  const preference = new Preference(client);

  const response = await preference.create({
  body: {
    items: [
      {
          title: "Producto ejemplo",
          quantity: 1,
          unit_price: 20000,
          currency_id: "COP",
          id: ""
      },
    ],
  },
});

  return Response.json({ id: response.id });
}