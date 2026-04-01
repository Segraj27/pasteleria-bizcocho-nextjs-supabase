"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-8">

        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-3xl">✅</span>
        </div>

        <h1 className="text-3xl font-bold mb-4 text-green-600">
          Pago exitoso
        </h1>

        <p className="text-gray-600 mb-6">
          Tu pago fue procesado correctamente. Estamos confirmando tu pedido.
        </p>

        <Link href="/pedidos" className="btn btn-primary">
          Ver pedidos
        </Link>

      </div>
    </div>
  );
}