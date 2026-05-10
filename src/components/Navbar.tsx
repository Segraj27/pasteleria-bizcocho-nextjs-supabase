"use client";

import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import UserDropdown from "./userdropdown/userdropdown";
import navbarCSS from "./navbarCss/navbar.module.css";

export default function Navbar() {

  // =================================
  // ROUTER
  // =================================

  const router = useRouter();

  // =================================
  // ESTADOS
  // =================================

  // Detecta scroll del navbar
  const [scrolled, setScrolled] = useState(false);

  // Usuario autenticado
  const [user, setUser] = useState<User | null>(null);

  // Rol del usuario
  // Puede ser:
  // admin | user | null
  const [role, setRole] = useState<string | null>(null);

  // Control menú responsive
  const [isOpen, setIsOpen] = useState(false);

  // =================================
  // FUNCIONES MENÚ
  // =================================

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false);

  // =================================
  // EFECTO SCROLL
  // =================================

  useEffect(() => {

    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };

  }, []);

  // =================================
  // OBTENER ROL USUARIO
  // =================================
  // CORRECCIÓN:
  // Se consulta la tabla profiles
  // para saber si el usuario es
  // admin o user.
  // =================================

  const fetchUserRole = async (userId: string) => {

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error obteniendo rol:", error);
      return;
    }

    // Guardar rol
    setRole(profile?.role || "user");
  };

  // =================================
  // AUTENTICACIÓN
  // =================================

  useEffect(() => {

    // Obtener usuario actual
    const getUser = async () => {

      const { data } = await supabase.auth.getUser();

      const currentUser = data.user;

      // Guardar usuario
      setUser(currentUser);

      // Si existe usuario → obtener rol
      if (currentUser) {
        await fetchUserRole(currentUser.id);
      }
    };

    getUser();

    // =================================
    // LISTENER SESIÓN
    // =================================
    // Detecta login/logout en tiempo real
    // =================================

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {

        const currentUser = session?.user ?? null;

        setUser(currentUser);

        // Si existe usuario → obtener rol
        if (currentUser) {

          await fetchUserRole(currentUser.id);

        } else {

          // Limpiar rol
          setRole(null);
        }
      }
    );

    // Limpiar listener
    return () => {
      listener.subscription.unsubscribe();
    };

  }, []);

  // =================================
  // LOGOUT
  // =================================

  const handleLogout = async () => {

    // CORRECCIÓN:
    // Actualización inmediata UI
    setUser(null);
    setRole(null);

    // Cerrar menú responsive
    if (isOpen) setIsOpen(false);

    try {

      // Logout Supabase
      await supabase.auth.signOut();

      // Redirección
      router.push("/");
      router.refresh();

    } catch (error) {

      console.error("Error al cerrar sesión:", error);

      // Fallback extremo
      window.location.href = "/";
    }
  };

  // =================================
  // RENDER
  // =================================

  return (

    <nav
      style={{
        position: "sticky",
        border: "none",
        marginBottom: "0px",
        zIndex: 1000,
        overflow: "visible",
      }}
      className={`navbar navbar-expand-lg ${navbarCSS.miNavbar} navbar-dark py-2 ${
        scrolled ? "scrolled" : ""
      }`}
    >

      <div className="container">

        {/* =================================
            LOGO
        ================================= */}

        <Link href="/" className="navbar-brand fw-bold">

          <h1 className="titulo">
            🍰 Pastelería El Bizcocho 🍪
          </h1>

        </Link>

        {/* =================================
            BOTÓN RESPONSIVE
        ================================= */}

        <button
          className="navbar-toggler"
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* =================================
            MENÚ NAVBAR
        ================================= */}

        <div
          className={`collapse navbar-collapse ${
            isOpen ? "show" : ""
          }`}
        >

          <div className="d-flex ms-auto align-items-center gap-3 mt-3 mt-lg-0">

            {/* =================================
                BOTÓN HACER PEDIDO
            =================================
            CORRECCIÓN:
            Solo usuarios normales
            podrán verlo.

            El admin NO verá este botón.
            ================================= */}

            {role && role !== "admin" && (
              <Link
                href="/pasteles"
                className="btn btn-cta px-4 rounded-pill fw-bold"
                style={{
                  backgroundColor: "#ff8a65",
                  color: "white",
                }}
                onClick={closeMenu}
              >
                Hacer pedido
              </Link>
            )}

            {/* =================================
                USUARIO NO AUTENTICADO
            ================================= */}

            {!user ? (
              <>

                <Link
                  href="/login"
                  className="nav-link text-white small"
                  onClick={closeMenu}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="nav-link text-white small"
                  onClick={closeMenu}
                >
                  Registrate
                </Link>

              </>
            ) : (
              <>

                {/* =================================
                    ADMINISTRADOR
                =================================
                CORRECCIÓN:
                Solo admin verá
                gestión de pedidos.
                ================================= */}

                {role === "admin" && (
                  <Link
                    href="/pedidos"
                    className="nav-link fw-bold"
                    style={{
                      color: "#ffd54f",
                    }}
                    onClick={closeMenu}
                  >
                    Gestionar Pedidos
                  </Link>
                )}

                {/* =================================
                    DROPDOWN USUARIO
                ================================= */}

                <UserDropdown
                  user={user}
                  role={role}
                  handleLogout={handleLogout}
                />

              </>
            )}

          </div>
        </div>
      </div>

      {/* =================================
          EFECTO CHOCOLATE DERRETIDO
      ================================= */}

      <div
        className={navbarCSS.drip}
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          backgroundImage: "url('/drip.png')",
          lineHeight: 0,
          zIndex: -100,
        }}
      />

    </nav>
  );
}