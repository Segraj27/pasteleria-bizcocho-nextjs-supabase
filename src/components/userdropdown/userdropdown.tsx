'use client';

import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { useState, useRef, useEffect } from 'react';

export default function UserDropdown({ user, handleLogout }: { user: User; handleLogout: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "Usuario";
  const inicial = name.charAt(0).toUpperCase();

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef} style={{ position: 'relative' }}>
      <button 
        className="btn btn-link text-white text-decoration-none d-flex align-items-center gap-2 p-0 border-0"
        type="button"
        onClick={() => setIsOpen(!isOpen)} // Control manual en lugar de bootstrap data-attr
      >
        <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center fw-bold" 
             style={{ width: '32px', height: '32px', color: '#3c1508' }}>
          {inicial}
        </div>
        <span className="fw-bold text-white d-none d-md-inline">
          {name}
        </span>
      </button>

      {/* Menú desplegable manual */}
      <ul 
        className={`dropdown-menu dropdown-menu-end shadow border-0 ${isOpen ? 'show' : ''}`} 
        style={{ 
          backgroundColor: '#3c1508', 
          position: 'absolute', 
          right: 0, 
          top: '100%',
          zIndex: 9999, // Asegura que esté por encima de todo
          minWidth: '200px',
          display: isOpen ? 'block' : 'none'
        }}
      >
        <li className="px-3 py-2">
          <span className="text-white-50 small d-block">{user.email}</span>
        </li>
        <li><hr className="dropdown-divider border-secondary" /></li>
        <li>
          <Link href="/carrito" className="dropdown-item text-white py-2" onClick={() => setIsOpen(false)}>
            🛒 Mi Carrito
          </Link>
        </li>
        <li>
          <button 
            className="dropdown-item text-danger d-flex align-items-center gap-2 py-2" 
            onClick={() => {
                console.log("Botón presionado");
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