"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/app/dashboard/components";
import { createClient } from "@/utils/supabase/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ProyectoDetallePage({ params }: { params: any }) {
  const resolved = React.use(params as any);
  const { id } = resolved as { id: string };
  const supabase = createClient();
  const [proyecto, setProyecto] = useState<any | null>(null);
  const [linkedPracticantes, setLinkedPracticantes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: supaError } = await supabase.from("proyectos").select("*").eq("id", id).single();
        if (supaError || !data) {
          setError(supaError?.message || "Proyecto no encontrado");
          setProyecto(null);
        } else {
          setProyecto({
            ...data,
            practicantes: Array.isArray(data.practicantes) ? data.practicantes : (typeof data.practicantes === 'string' ? JSON.parse(data.practicantes || '[]') : []),
          });
          // Fetch linked practicantes if practicantes field contains ids
          const ids = Array.isArray(data.practicantes) ? data.practicantes : (typeof data.practicantes === 'string' ? JSON.parse(data.practicantes || '[]') : []);
          if (ids.length > 0) {
            try {
              const { data: practData } = await supabase.from('practicantes').select('id,nombre,carrera').in('id', ids);
              setLinkedPracticantes(practData || []);
            } catch (e) {
              setLinkedPracticantes([]);
            }
          }
        }
      } catch (err: any) {
        setError(err?.message ?? "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id, supabase]);

  if (loading) return <div className="flex h-screen w-full bg-gray-50 text-gray-900"><Sidebar /><div className="flex-1 p-8">Cargando...</div></div>;
  if (error || !proyecto) return <div className="flex h-screen w-full bg-gray-50 text-gray-900"><Sidebar /><div className="flex-1 p-8 text-red-600">Error: {error || 'Proyecto no encontrado'}</div></div>;

  return (
    <div className="flex h-screen w-full bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto p-8 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <Link href="/proyectos" className="flex items-center text-gray-600 hover:text-blue-600 transition"><ChevronLeft className="w-5 h-5 mr-1" />Volver</Link>
          <div className="flex gap-3">
            <Link href={`/proyectos/${id}/edit`} className="px-3 py-2 border rounded-lg hover:bg-gray-100">Editar</Link>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h1 className="text-2xl font-bold mb-2">{proyecto.nombre}</h1>
          <p className="text-gray-600 mb-4">{proyecto.descripcion}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-2">Cliente</h3>
              <p>{proyecto.cliente}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-2">Líder</h3>
              <p>{proyecto.lider}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-2">Estado</h3>
              <p>{proyecto.estado}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-2">Practicantes</h3>
              <div className="flex flex-wrap gap-2">
                {linkedPracticantes.length > 0 ? (
                  linkedPracticantes.map((pr: any) => (
                    <span key={pr.id} className="px-3 py-1 rounded-full bg-gray-200 text-gray-700">{pr.nombre}</span>
                  ))
                ) : (
                  proyecto.practicantes.map((pr: any, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-gray-200 text-gray-700">{String(pr)}</span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
