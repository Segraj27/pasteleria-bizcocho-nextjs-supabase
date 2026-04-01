"use client";

import Link from "next/link";

export default function PendingPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-8">

        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-100 flex items-center justify-center">
          <span className="text-3xl">⏳</span>
        </div>

        <h1 className="text-3xl font-bold mb-4 text-yellow-600">
          Pago pendiente
        </h1>

        <p className="text-gray-600 mb-6">
          Tu pago está en proceso de validación. Esto puede tardar unos minutos.
        </p>

        <Link href="/pedidos" className="btn btn-primary">
          Volver a pedidos
        </Link>

      </div>
    </div>
  );
}