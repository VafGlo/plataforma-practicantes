"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/app/dashboard/components";
import { createClient } from "@/utils/supabase/client";
import { ChevronLeft, Save, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type FormState = {
  nombre: string;
  descripcion: string;
  cliente: string;
  lider: string;
  estado: string;
  practicantes: string; // comma
};

export default function EditProyectoPage({ params }: { params: any }) {
  const resolved = React.use(params as any);
  const { id } = resolved as { id: string };
  const supabase = createClient();
  const router = useRouter();

  const [form, setForm] = useState<FormState>({ nombre: "", descripcion: "", cliente: "", lider: "", estado: "Activo", practicantes: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [practicantesList, setPracticantesList] = useState<any[]>([]);
  const [selectedPracticantes, setSelectedPracticantes] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, error: supaError } = await supabase.from("proyectos").select("*").eq("id", id).single();
        if (supaError || !data) {
          setError(supaError?.message || "Proyecto no encontrado");
          return;
        }
        setForm({
          nombre: data.nombre || "",
          descripcion: data.descripcion || "",
          cliente: data.cliente || "",
          lider: data.lider || "",
          estado: data.estado || "Activo",
          practicantes: Array.isArray(data.practicantes) ? data.practicantes.join(", ") : (data.practicantes || ""),
        });
        const { data: practData } = await supabase.from("practicantes").select("id,nombre,carrera").order("nombre", { ascending: true });
        setPracticantesList(practData || []);
        const ids = Array.isArray(data.practicantes) ? data.practicantes : (typeof data.practicantes === 'string' ? JSON.parse(data.practicantes || '[]') : []);
        setSelectedPracticantes(ids.map(String));
      } catch (err: any) {
        setError(err?.message ?? "Error cargando proyecto");
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id, supabase]);

  const handleChange = (k: keyof FormState, val: string) => setForm((s) => ({ ...s, [k]: val }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload: any = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        cliente: form.cliente,
        lider: form.lider,
        estado: form.estado,
        practicantes: selectedPracticantes,
      };

      const { error: supaError } = await supabase.from("proyectos").update(payload).eq("id", id);
      if (supaError) setError(supaError.message);
      else router.push(`/proyectos/${id}`);
    } catch (err: any) {
      setError(err?.message ?? "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto p-8 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <Link href={`/proyectos/${id}`} className="flex items-center text-gray-600 hover:text-blue-600 transition"><ChevronLeft className="w-5 h-5 mr-1" />Volver</Link>
          <div className="flex items-center gap-3">
            <button onClick={handleSave} disabled={saving} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">
              <Save className="w-4 h-4" /> <span>{saving ? "Guardando..." : "Guardar"}</span>
            </button>
            <Link href={`/proyectos/${id}`} className="flex items-center space-x-2 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition"><X className="w-4 h-4" /><span>Cancelar</span></Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          {loading ? (
            <div>Cargando...</div>
          ) : error ? (
            <div className="text-red-600">Error: {error}</div>
          ) : (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Nombre</label>
                <input value={form.nombre} onChange={(e) => handleChange("nombre", e.target.value)} className="w-full border p-2 rounded mt-1" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Cliente</label>
                <input value={form.cliente} onChange={(e) => handleChange("cliente", e.target.value)} className="w-full border p-2 rounded mt-1" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Líder</label>
                <input value={form.lider} onChange={(e) => handleChange("lider", e.target.value)} className="w-full border p-2 rounded mt-1" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Estado</label>
                <select value={form.estado} onChange={(e) => handleChange("estado", e.target.value)} className="w-full border p-2 rounded mt-1">
                  <option value="Activo">Activo</option>
                  <option value="En pausa">En pausa</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Descripción</label>
                <textarea value={form.descripcion} onChange={(e) => handleChange("descripcion", e.target.value)} className="w-full border p-2 rounded mt-1" rows={4} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Practicantes</label>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-auto border rounded p-2">
                  {practicantesList.map((pr) => (
                    <label key={pr.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedPracticantes.includes(String(pr.id))}
                        onChange={() => {
                          setSelectedPracticantes((s) =>
                            s.includes(String(pr.id)) ? s.filter((x) => x !== String(pr.id)) : [...s, String(pr.id)]
                          );
                        }}
                      />
                      <span className="text-sm">{pr.nombre} <span className="text-xs text-gray-500">• {pr.carrera}</span></span>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
