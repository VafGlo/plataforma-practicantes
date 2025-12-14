"use client";

import React, { useState } from "react";
import { Sidebar } from "@/app/dashboard/components";
import { createClient } from "@/utils/supabase/client";
import { ChevronLeft, Save, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type FormState = {
  nombre: string;
  carrera: string;
  email: string;
  area: string;
  tecnologias: string; // comma-separated
  estado: string;
  descripcion: string;
  telefono: string;
  portafolio_url: string;
  soft_skills: string; // comma-separated
  proyectos: string; // comma-separated
};

export default function NewPracticantePage() {
  const supabase = createClient();
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    nombre: "",
    carrera: "",
    email: "",
    area: "",
    tecnologias: "",
    estado: "disponible",
    descripcion: "",
    telefono: "",
    portafolio_url: "",
    soft_skills: "",
    proyectos: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (k: keyof FormState, val: string) => {
    setForm((s) => ({ ...s, [k]: val }));
  };

  const handleCreate = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload: any = {
        nombre: form.nombre,
        carrera: form.carrera,
        email: form.email,
        area: form.area,
        tecnologias: form.tecnologias.split(",").map((t) => t.trim()).filter(Boolean),
        estado: form.estado,
        descripcion: form.descripcion,
        telefono: form.telefono,
        portafolio_url: form.portafolio_url,
        soft_skills: form.soft_skills.split(",").map((s) => s.trim()).filter(Boolean),
        proyectos: form.proyectos.split(",").map((p) => p.trim()).filter(Boolean),
      };

      const { data, error: supaError } = await supabase
        .from("practicantes")
        .insert(payload)
        .select()
        .single();

      if (supaError) {
        setError(supaError.message);
      } else if (data) {
        router.push(`/practicantes/${data.id}`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Error al crear practicante");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto p-8 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <Link href="/practicantes" className="flex items-center text-gray-600 hover:text-blue-600 transition">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Volver
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreate}
              disabled={saving}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Creando..." : "Crear"}</span>
            </button>
            <Link href="/practicantes" className="flex items-center space-x-2 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition">
              <X className="w-4 h-4" />
              <span>Cancelar</span>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          {error && <div className="text-red-600 mb-4">Error: {error}</div>}
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Nombre</label>
              <input value={form.nombre} onChange={(e) => handleChange("nombre", e.target.value)} className="w-full border p-2 rounded mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input value={form.email} onChange={(e) => handleChange("email", e.target.value)} className="w-full border p-2 rounded mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Carrera</label>
              <input value={form.carrera} onChange={(e) => handleChange("carrera", e.target.value)} className="w-full border p-2 rounded mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Área</label>
              <input value={form.area} onChange={(e) => handleChange("area", e.target.value)} className="w-full border p-2 rounded mt-1" />
            </div>

            <div>
              <label className="text-sm text-gray-600">Tecnologías (separadas por coma)</label>
              <input value={form.tecnologias} onChange={(e) => handleChange("tecnologias", e.target.value)} className="w-full border p-2 rounded mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Disponibilidad</label>
              <select value={form.estado} onChange={(e) => handleChange("estado", e.target.value)} className="w-full border p-2 rounded mt-1">
                <option value="disponible">Disponible</option>
                <option value="asignado">No disponible</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Descripción</label>
              <textarea value={form.descripcion} onChange={(e) => handleChange("descripcion", e.target.value)} className="w-full border p-2 rounded mt-1" rows={4} />
            </div>

            <div>
              <label className="text-sm text-gray-600">Teléfono</label>
              <input value={form.telefono} onChange={(e) => handleChange("telefono", e.target.value)} className="w-full border p-2 rounded mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Portafolio URL</label>
              <input value={form.portafolio_url} onChange={(e) => handleChange("portafolio_url", e.target.value)} className="w-full border p-2 rounded mt-1" />
            </div>

            <div>
              <label className="text-sm text-gray-600">Soft Skills (comma)</label>
              <input value={form.soft_skills} onChange={(e) => handleChange("soft_skills", e.target.value)} className="w-full border p-2 rounded mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Proyectos (comma)</label>
              <input value={form.proyectos} onChange={(e) => handleChange("proyectos", e.target.value)} className="w-full border p-2 rounded mt-1" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
