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

const [isOpen, setIsOpen] = useState(false);

const toggleMenu = () => setIsOpen(!isOpen);
const closeMenu = () => setIsOpen(false); // Útil para cerrar al hacer clic en un link

  return (
    <nav style={{
    background: "linear-gradient(to bottom, #4b2c20 0%, #562504 50%, #3c1508 100%)",
    position: "relative",
    border: "none",
    zIndex: 1050 // que este encima de todo
  }}
  className={`navbar navbar-expand-lg navbar-pasteleria ${scrolled ? "scrolled" : ""}`}
>
      <div className="container">
      <Link href="/" className="navbar-brand">
        🍰 Pastelería El Bizcocho
      </Link>

      {/* Botón controlado por React */}
      <button
        className="navbar-toggler"
        type="button"
        onClick={toggleMenu}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Clase 'show' controlada por el estado */}
      <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
        <ul className="navbar-nav ms-auto align-items-lg-center">
          
          <li className="nav-item ms-lg-3 mt-2 mt-lg-0 py-2"> {/* py-2 añade el padding vertical */}
            <Link href="/pasteles" className="btn btn-cta" onClick={closeMenu}>
              <i className="bi bi-pencil-square me-1"></i>
              Hacer pedido
            </Link>
          </li>

          <li className="nav-item px-lg-2 py-1"> {/* px-lg-2 da separación horizontal en PC */}
            <Link
              href="/"
              className={`nav-link ${pathname === "/" ? "active" : ""}`}
              onClick={closeMenu}
            >
              <i className="bi bi-house-door me-1"></i>
              Inicio
            </Link>
          </li>

          <li className="nav-item px-lg-2 py-1">
            <Link
              href="/pedidos"
              className={`nav-link ${pathname === "/pedidos" ? "active" : ""}`}
              onClick={closeMenu}
            >
              <i className="bi bi-cake2 me-1"></i>
              Pedidos
            </Link>
          </li>

          <li className="nav-item px-lg-2 py-1">
            <Link
              href="/pasteles"
              className={`nav-link ${pathname === "/pasteles" ? "active" : ""}`}
              onClick={closeMenu}
            >
              <i className="bi bi-cake2 me-1"></i>
              Pasteles
            </Link>
          </li>

          {!user ? (
            <>
              <li className="nav-item px-lg-2 py-1">
                <Link href="/login" className="nav-link" onClick={closeMenu}>
                  Iniciar sesión
                </Link>
              </li>
              <li className="nav-item px-lg-2 py-1">
                <Link href="/register" className="nav-link" onClick={closeMenu}>
                  Registrarse
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item px-lg-2 py-1">
                <span className="nav-link fw-bold text-white">
                  👤 {user.user_metadata?.full_name || user.email}
                </span>
              </li>
              <li className="nav-item py-1">
                <button
                  onClick={() => { handleLogout(); closeMenu(); }}
                  className="btn btn-sm btn-outline-light ms-lg-2"
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
