"use client";

import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { useState, useRef, useEffect } from "react";

// =================================
// INTERFAZ DE PROPS
// =================================
// CORRECCIÓN:
// Ahora recibimos también el role
// para diferenciar admin y usuario.
// =================================

interface UserDropdownProps {
  user: User;
  role: string | null;
  handleLogout: () => void;
}

export default function UserDropdown({
  user,
  role,
  handleLogout,
}: UserDropdownProps) {

  // =================================
  // ESTADO DROPDOWN
  // =================================

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // =================================
  // DATOS USUARIO
  // =================================

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Usuario";

  const inicial = name.charAt(0).toUpperCase();

  // =================================
  // CERRAR DROPDOWN AL HACER CLICK FUERA
  // =================================

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  // =================================
  // RENDER
  // =================================

  return (
    <div
      className="dropdown"
      ref={dropdownRef}
      style={{
        position: "relative",
        zIndex: 3000,
      }}
    >

      {/* =================================
          BOTÓN PERFIL
      ================================= */}

      <button
        className="btn btn-link text-white text-decoration-none d-flex align-items-center gap-2 p-0 border-0"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className="bg-warning rounded-circle d-flex align-items-center justify-content-center fw-bold"
          style={{
            width: "32px",
            height: "32px",
            color: "#3c1508",
          }}
        >
          {inicial}
        </div>

        {/* =================================
            NOMBRE + ROLE
        =================================
        CORRECCIÓN:
        Solo el admin verá
        el rol entre paréntesis.
        ================================= */}

        <div className="d-none d-md-flex align-items-center gap-1">

          {/* =================================
              NOMBRE USUARIO
          ================================= */}

          <span className="fw-bold text-white">
            {name}
          </span>

          {/* =================================
              ROLE SOLO ADMIN
          ================================= */}

          {role === "admin" && (
            <span
              className="text-white-50"
              style={{
                fontSize: "0.9rem",
              }}
            >
              (admin)
            </span>
          )}
        </div>
      </button>

      {/* =================================
          MENÚ DROPDOWN
      ================================= */}

      <ul
        className={`dropdown-menu dropdown-menu-end shadow border-0 ${
          isOpen ? "show" : ""
        }`}
        style={{
          backgroundColor: "#4c2e20",
          position: "absolute",
          right: 0,
          top: "110%",
          zIndex: 2000,
          minWidth: "220px",
          display: isOpen ? "block" : "none",
          padding: "12px 8px",
          borderRadius: "12px",
          overflow: "visible",
        }}
      >

        {/* =================================
            EMAIL USUARIO
        ================================= */}

        <li className="px-3 py-2">
          <span className="text-white-50 small d-block">
            {user.email}
          </span>
        </li>

        <li>
          <hr className="dropdown-divider border-secondary" />
        </li>

        {/* =================================
            OPCIONES USUARIO NORMAL
        =================================
        CORRECCIÓN:
        El admin NO verá carrito.
        ================================= */}

        {role !== "admin" && (
          <li>
            <Link
              href="/carrito"
              className="dropdown-item text-black py-2"
              onClick={() => setIsOpen(false)}
            >
              Tu Carrito 🛒
            </Link>
          </li>
        )}

        {/* =================================
            OPCIONES ADMIN
        =================================
        CORRECCIÓN:
        Solo admin verá gestión de pedidos.
        ================================= */}

        {role === "admin" && (
          <li>
            <Link
              href="/pedidos"
              className="dropdown-item text-black py-2"
              onClick={() => setIsOpen(false)}
            >
              Gestionar Pedidos 📋
            </Link>
          </li>
        )}

        {/* =================================
            CERRAR SESIÓN
        ================================= */}

        <li>
          <button
            className="dropdown-item text-black d-flex align-items-center gap-2 py-2"
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
          >
            <span>Cerrar sesión</span>
          </button>
        </li>
      </ul>
    </div>
  );
}