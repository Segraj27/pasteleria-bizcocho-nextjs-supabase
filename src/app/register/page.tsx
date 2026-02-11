"use client";

import { useState } from "react";
import { supabase } from "@/services/supabaseClient";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "Registro exitoso. Revisa tu correo para confirmar la cuenta.",
      );
    }

    setLoading(false);
  };

  return (
    <section className="auth-page">
      <div className="container">
        <h1 className="text-center mb-4">Crear cuenta</h1>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-cta w-100"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrarme"}
          </button>

          {message && <p className="text-center mt-3">{message}</p>}
        </form>
      </div>
    </section>
  );
}
