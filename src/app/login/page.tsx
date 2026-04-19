"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Mail, Lock, Loader2 } from "lucide-react"; 
import styles from "./login.module.css"; // Importación correcta

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

    if (error) {
      setMessage("Credenciales incorrectas. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    const session = data.session;
    if (!session) {
      setMessage("Error al sincronizar la sesión.");
      setLoading(false);
      return;
    }

    window.location.href = "/pedidos";
  };

  return (
    <div className={styles.authPageWrapper}>
      <div className={styles.authOverlay}>
        
        <form onSubmit={handleLogin} className={styles.premiumAuthForm}>
          <div className={styles.formHeader}>
            <h1>Iniciar sesión</h1>
          </div>

          <div className={styles.inputGroup}>
            <Mail className={styles.inputIcon} size={20} />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock className={styles.inputIcon} size={20} />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>

          <button type="submit" className={styles.btnLoginPremium} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className={styles.spinner} size={20} />
                <span>Ingresando...</span>
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>

          {message && (
            <div className={`${styles.authMessage} ${message.includes('exitoso') ? styles.success : styles.error}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}