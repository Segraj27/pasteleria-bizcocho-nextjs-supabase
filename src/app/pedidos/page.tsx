"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

interface Pastel {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  activo: boolean;
}

export default function PedidosPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [pasteles, setPasteles] = useState<Pastel[]>([]);
  const [loading, setLoading] = useState(true);

  // 🎂 Obtener pasteles
  useEffect(() => {
    const initPage = async () => {
      setLoading(true);

      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setLoading(false);
        router.replace("/login");
        return;
      }

      setUser(data.user);

      const { data: pastelesData, error: pastelesError } = await supabase
        .from("pasteles")
        .select("*")
        .eq("activo", true);

      if (pastelesError) {
        console.error("Error al obtener pasteles:", pastelesError);
      } else {
        setPasteles((pastelesData as Pastel[]) || []);
      }

      setLoading(false);
    };

    initPage();
  }, []);
  if (loading) {
    return <p className="text-center mt-5">Cargando pasteles...</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Selecciona tu pastel 🎂</h1>

      <div className="row">
        {pasteles.map((pastel) => (
          <div key={pastel.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                src={pastel.imagen_url}
                className="card-img-top"
                alt={pastel.nombre}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{pastel.nombre}</h5>
                <p className="card-text">{pastel.descripcion}</p>
                <p className="fw-bold mt-auto">
                  ${pastel.precio.toLocaleString()}
                </p>
                <button className="btn btn-cta mt-2">Personalizar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
