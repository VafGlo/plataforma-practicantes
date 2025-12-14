"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/app/dashboard/components";
import { createClient } from "@/utils/supabase/client";
import ProyectosTable from "./components";

export default function ProyectosPage() {
  const supabase = createClient();
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [practicantesList, setPracticantesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProyectos();
  }, []);

  const loadProyectos = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supaError } = await supabase
        .from("proyectos")
        .select("*")
        // Ordenar por 'id' para evitar errores si la columna 'nombre' no existe
        .order("id", { ascending: true });

      if (supaError) {
        setError(supaError.message);
        setProyectos([]);
      } else if (!data) {
        setProyectos([]);
      } else {
        const formatted = (data as any[]).map((p) => ({
          ...p,
          practicantes: Array.isArray(p.practicantes) ? p.practicantes : (typeof p.practicantes === 'string' ? JSON.parse(p.practicantes || '[]') : []),
        }));
        setProyectos(formatted);
      
      // Cargar practicantes una sola vez para mapear en la tabla
      const { data: practData } = await supabase.from("practicantes").select("id,nombre,carrera").order("nombre", { ascending: true });
      setPracticantesList(practData || []);
      }
    } catch (err: any) {
      setError(err?.message ?? "Error desconocido");
      setProyectos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Proyectos</h1>

          <a href="/proyectos/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            + Nuevo Proyecto
          </a>
        </div>

        <div>
          {loading ? (
            <div className="py-8">Cargando proyectos...</div>
          ) : error ? (
            <div className="text-red-600 py-4">Error: {error}</div>
          ) : (
            <ProyectosTable proyectos={proyectos} onDelete={loadProyectos} practicantesList={practicantesList} />
          )}
        </div>
      </main>
    </div>
  );
}
