"use client";

import { useState } from "react";
import { supabase } from "@/services/supabaseClient";

export default function RegisterPage() {
  // Estados del formulario
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Función para registrar usuario
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Cuenta creada exitosamente 🎉 Revisa tu correo.");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <img src="/decor/bakery.png" className="decor-left" />
      <img src="/decor/baker.png" className="decor-right" />
      <form onSubmit={handleRegister} className="auth-form">
        <h1>Crear cuenta</h1>

        <input
          type="text"
          placeholder="Nombre completo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

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

        <button disabled={loading}>
          {loading ? "Creando cuenta..." : "Registrarme"}
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
