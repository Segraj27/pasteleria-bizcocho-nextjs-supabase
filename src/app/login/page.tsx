"use client";

import { useState } from "react";
import { supabase } from "@/services/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Inicio de sesión exitoso 🎉");
      window.location.href = "/pedidos";
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <img src="/decor/cake.png" className="decor-left" />
      <img src="/decor/cupcake.png" className="decor-right" />
      <form onSubmit={handleLogin} className="auth-form">
        <h1>Iniciar sesión</h1>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>

        {message && <p className="auth-message">{message}</p>}
      </form>
    </div>
  );
}
