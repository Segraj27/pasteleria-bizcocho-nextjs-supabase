"use client";

import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import UserDropdown from "./userdropdown/userdropdown";
import navbarCSS from "./navbarCss/navbar.module.css";


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
    // - PASO 1: ACTUALIZACIÓN INSTANTÁNEA --
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
        // Gradiente sutil que termina exactamente en el color de la imagen
        position: "sticky",
        border: "none",
        marginBottom: '0px', // Asegúrate de que no tenga padding inferior
        zIndex: 1000, // Asegura que el nav esté arriba
        overflow: "visible"
      }}
      className={`navbar navbar-expand-lg ${navbarCSS.miNavbar} navbar-dark py-2 ${scrolled ? "scrolled" : ""}`}
    >
      <div className="container">
        {/* 1. LOGO IZQUIERDA */}
        <Link href="/" className="navbar-brand fw-bold" >
           <h4 className="titulo"> 🍰 Pastelería El Bizcocho🍪</h4>
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
      <div className={navbarCSS.drip} style={{
        position: 'absolute',
        top: 0, // Solapado 2px para fundirse con el fondo oscuro del nav
        width: '100%',
         // Altura de las gotas
        backgroundImage: "url('/drip.png')", // <--- Asegúrate de que se llame así en tu carpeta /public
        lineHeight: 0,
        zIndex: -100, // Queda justo debajo del borde del navbar que es el chocolate la imagen
      }}
      />

    </nav>
  );

}
