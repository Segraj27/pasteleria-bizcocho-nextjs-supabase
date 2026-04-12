"use client";

import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import UserDropdown from "./userdropdown/userdropdown";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        setRole(profile?.role);
      }
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", currentUser.id)
            .single();

          setRole(profile?.role);
        } else {
          setRole(null);
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    // --- PASO 1: ACTUALIZACIÓN INSTANTÁNEA ---
    // Cambiamos el estado local de inmediato para que el Navbar 
    // muestre "Login / Registro" sin esperar al servidor.
    setUser(null);
    setRole(null);
    if (isOpen) setIsOpen(false); // Cierra el menú móvil si está abierto

    // --- PASO 2: PROCESO EN SEGUNDO PLANO ---
    try {
      // Ejecutamos el cierre de sesión en Supabase
      await supabase.auth.signOut();

      // Limpiamos la caché de Next.js y redirigimos
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor:", error);
      // Si hubo un error crítico, forzamos recarga total para limpiar todo
      window.location.href = "/";
    }
  };

  return (
    <nav
      style={{
        background: "linear-gradient(to bottom, #4b2c20 0%, #562504 50%, #3c1508 100%)",
        position: "relative",
        zIndex: 100, // capa de atras navbar chocolate
        border: "none"
      }}
      className={`navbar navbar-expand-lg navbar-dark py-2 ${scrolled ? "scrolled" : ""}`}
    >
      <div className="container">
        {/* 1. LOGO IZQUIERDA */}
        <Link href="/" className="navbar-brand fw-bold">
          🍰 Pastelería El Bizcocho
        </Link>

        <button className="navbar-toggler" onClick={toggleMenu}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>

          {/* 3. ACCIONES DERECHA (Iconos y CTA) */}
          <div className="d-flex ms-auto align-items-center gap-3 mt-3 mt-lg-0">

            {/* BOTÓN PRINCIPAL (Destacado) */}
            <Link
              href="/pasteles"
              className="btn btn-cta px-4 rounded-pill fw-bold"
              style={{ backgroundColor: '#ff8a65', color: 'white' }}
              onClick={closeMenu}
            >
              Hacer pedido
            </Link>

            {!user ? (
              <>
                {/* Si NO hay usuario, mostramos Login y Registrate */}
                <Link href="/login" className="nav-link text-white small" onClick={closeMenu}>
                  Login
                </Link>

                <Link href="/register" className="nav-link text-white small" onClick={closeMenu}>
                  Registrate
                </Link>
              </>
            ) : (
              /* Si HAY usuario, mostramos el Dropdown con su perfil */
              <UserDropdown user={user} handleLogout={handleLogout} />
            )}


          </div>
        </div>
      </div>

      {/* CHOCOLATE DERRETIDO */}
      <div className="nav-drip" style={{ position: 'absolute', top: '100%', left: 0, width: '100%', height: '35px', zIndex: -1, lineHeight: 0 }}>
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <path fill="#3c1508" d="M0,0 L1440,0 L1440,40 C1320,100 1200,100 1080,40 C960,-20 840,-20 720,40 C600,100 480,100 360,40 C240,-20 120,-20 0,40 Z"></path>
        </svg>
      </div>
    </nav>
  );

}
