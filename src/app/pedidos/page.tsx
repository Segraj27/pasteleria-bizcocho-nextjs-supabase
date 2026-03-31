"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectPedidos() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/pedidos");
  }, []);

  return null;
}
