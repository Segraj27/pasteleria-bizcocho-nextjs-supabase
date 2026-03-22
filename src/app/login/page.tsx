"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // ❌ error en login
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    // 🔥 verificar sesión correctamente
    const session = data.session;

    console.log("SESSION LOGIN:", session);

    if (!session) {
      setMessage("No se guardó la sesión");
      setLoading(false);
      return;
    }

    // ✅ login exitoso
    setMessage("Inicio de sesión exitoso 🎉");

    // 🔥 recarga completa para sincronizar sesión
    window.location.href = "/pedidos";
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
