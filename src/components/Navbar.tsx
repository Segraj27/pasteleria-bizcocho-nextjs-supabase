"use client";

import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // 🔹 Detectar scroll
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 🔹 Detectar sesión activa
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔹 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav style={{
    background: "linear-gradient(to bottom, #4b2c20 0%, #562504 50%, #3c1508 100%)",
    position: "relative",
    border: "none"
  }}
  className={`navbar navbar-expand-lg navbar-pasteleria ${scrolled ? "scrolled" : ""}`}
>
      <div className="container">
        <Link href="/" className="navbar-brand">
          🍰 Pastelería El Bizcocho
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
              <Link href="/pedidos" className="btn btn-cta">
                <i className="bi bi-pencil-square me-1"></i>
                Hacer pedido
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="/"
                className={`nav-link ${pathname === "/" ? "active" : ""}`}
              >
                <i className="bi bi-house-door me-1"></i>
                Inicio
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="/pedidos"
                className={`nav-link ${pathname === "/pedidos" ? "active" : ""
                  }`}
              >
                <i className="bi bi-cake2 me-1"></i>
                Pedidos
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="/pasteles"
                className={`nav-link ${pathname === "/pasteles" ? "active" : ""
                  }`}
              >
                <i className="bi bi-cake2 me-1"></i>
                Pasteles
              </Link>
            </li>

            {/* 🔐 Zona dinámica */}
            {!user ? (
              <>
                <li className="nav-item">
                  <Link href="/login" className="nav-link">
                    Iniciar sesión
                  </Link>
                </li>

                <li className="nav-item">
                  <Link href="/register" className="nav-link">
                    Registrarse
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <span className="nav-link fw-bold">
                    👤 {user.user_metadata?.full_name || user.email}
                  </span>
                </li>

                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-sm btn-outline-light ms-2"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

     {/* 🍫 CHOCOLATE SUTIL (Corregido para evitar doble tono) */}
  <div
    className="nav-drip"
    style={{
      position: 'absolute',
      top: 'calc(100% - 1px)', // Se solapa 1px para borrar la línea divisoria
      left: 0,
      width: '100%',
      height: '35px',        // <--- MUCHO MÁS PEQUEÑO: Se ve más elegante
      overflow: 'hidden',
      lineHeight: 0,
      zIndex: 10,
    }}
  >
    <svg
      viewBox="0 0 1440 100" // Reducimos el alto del lienzo para que las gotas sean chatas
      preserveAspectRatio="none"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Usamos el color de fondo más oscuro del nav para que la transición sea invisible */}
      <path
        fill="#3c1508" 
        d="M0,0 L1440,0 L1440,40 C1320,100 1200,100 1080,40 C960,-20 840,-20 720,40 C600,100 480,100 360,40 C240,-20 120,-20 0,40 Z"
      ></path>
    </svg>
  </div>
    </nav>
  );
}
