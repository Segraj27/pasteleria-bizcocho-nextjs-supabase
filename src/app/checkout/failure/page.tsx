"use client";

import Link from "next/link";

export default function FailurePage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-8">

        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-3xl">❌</span>
        </div>

        <h1 className="text-3xl font-bold mb-4 text-red-600">
          Pago fallido
        </h1>

        <p className="text-gray-600 mb-6">
          Hubo un problema con tu pago. Puedes intentarlo nuevamente.
        </p>

        <Link href="/pedidos" className="btn btn-warning">
          Intentar nuevamente
        </Link>

      </div>
    </div>
  );
}