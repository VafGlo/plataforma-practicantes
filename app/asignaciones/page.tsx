"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/app/dashboard/components";
import { UserPlus, User } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Practicante = {
  id: string;
  nombre: string;
  area?: string;
  foto?: string;
  habilidades?: string[];
};

type Proyecto = {
  id: string;
  nombre: string;
  practicantes?: any;
};

export default function AsignacionesPage() {
  const supabase = createClient();

  const [busqueda, setBusqueda] = useState("");
  const [areaFiltro, setAreaFiltro] = useState("Todas");
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState("");

  const [practicantes, setPracticantes] = useState<Practicante[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const areas = ["Todas", "Fullstack", "Frontend", "UX", "Mobile"];

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: practData, error: practErr } = await supabase.from("practicantes").select("id,nombre,apellido,area,tecnologias,estado").order("nombre", { ascending: true });
      const { data: projData, error: projErr } = await supabase.from("proyectos").select("id,nombre,practicantes").order("nombre", { ascending: true });

      if (practErr) throw practErr;
      if (projErr) throw projErr;

      setPracticantes((practData || []).map((p: any) => ({ id: String(p.id), nombre: `${p.nombre}${p.apellido ? ' ' + p.apellido : ''}`, area: p.area, habilidades: Array.isArray(p.tecnologias) ? p.tecnologias : (typeof p.tecnologias === 'string' ? JSON.parse(p.tecnologias || '[]') : []) })));
      setProyectos((projData || []).map((p: any) => ({ id: String(p.id), nombre: p.nombre, practicantes: p.practicantes })));
    } catch (e: any) {
      setError(e?.message ?? "Error cargando datos");
      // If practicantes query failed due to RLS or other, attempt a wider select for debugging
      try {
        const { data: fallbackPr } = await supabase.from("practicantes").select("*").limit(10);
        // Map fallback into practicantes state so UI shows available rows
        if (fallbackPr) setPracticantes((fallbackPr || []).map((p: any) => ({ id: String(p.id), nombre: `${p.nombre}${p.apellido ? ' ' + p.apellido : ''}`, area: p.area, habilidades: Array.isArray(p.tecnologias) ? p.tecnologias : (typeof p.tecnologias === 'string' ? JSON.parse(p.tecnologias || '[]') : []) })));
        // Also attempt to fetch proyectos if not already loaded
        try {
          const { data: projFallback, error: projFallbackErr } = await supabase.from('proyectos').select('id,nombre,practicantes').order('nombre', { ascending: true });
          if (projFallback) setProyectos((projFallback || []).map((p: any) => ({ id: String(p.id), nombre: p.nombre, practicantes: p.practicantes })));
        } catch {}
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Construir lista/array de practicantes asignados (puede contener ids, nombres o fragmentos)
  const assignedValues: string[] = [];
  proyectos.forEach((proj) => {
    let arr: any[] = [];
    if (Array.isArray(proj.practicantes)) arr = proj.practicantes;
    else if (typeof proj.practicantes === 'string') {
      try { arr = JSON.parse(proj.practicantes); } catch { arr = []; }
    }
    arr.forEach((x) => assignedValues.push(String(x)));
  });

  const practicantesFiltrados = practicantes.filter((p) => {
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchArea = areaFiltro === "Todas" || p.area === areaFiltro;
    // Considerar asignado si alguno de los valores asignados coincide con id, nombre completo o aparece como fragmento del nombre
    const isAssigned = assignedValues.some((val) => {
      if (!val) return false;
      const vl = val.toLowerCase();
      if (String(p.id).toLowerCase() === vl) return true;
      if (p.nombre && p.nombre.toLowerCase() === vl) return true;
      if (p.nombre && p.nombre.toLowerCase().includes(vl)) return true;
      return false;
    });
    return matchBusqueda && matchArea && !isAssigned;
  });

  // (debugging code removed)

  const handleAssign = async (pract: Practicante) => {
    if (!proyectoSeleccionado) return setError("Selecciona un proyecto primero");
    setAssigning(true);
    setError(null);
    try {
      const proj = proyectos.find((p) => p.id === String(proyectoSeleccionado));
      if (!proj) throw new Error("Proyecto no encontrado");
      let arr: any[] = [];
      if (Array.isArray(proj.practicantes)) arr = proj.practicantes;
      else if (typeof proj.practicantes === 'string') {
        try { arr = JSON.parse(proj.practicantes); } catch { arr = []; }
      }
      const idStr = String(pract.id);
      if (!arr.map(String).includes(idStr)) arr.push(idStr);
      const { error: updErr } = await supabase.from('proyectos').update({ practicantes: arr }).eq('id', proj.id);
      if (updErr) throw updErr;
      await loadData();
    } catch (e: any) {
      setError(e?.message ?? 'Error al asignar');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-bold mb-2">Asignación de Practicantes</h1>
        <p className="text-gray-600 mb-8">Asigna practicantes disponibles a proyectos activos</p>

        {error && <div className="mb-4 text-red-600">Error: {error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* counts removed per request */}
          {/* PANEL IZQUIERDO (LISTA DE PRACTICANTES) */}
          <div className="lg:col-span-2 bg-white rounded-xl border shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Practicantes Disponibles ({practicantesFiltrados.length})</h2>

            {/* BÚSQUEDA Y FILTRO */}
            <div className="flex gap-4 mb-6">
              <input className="flex-1 border rounded-md px-3 py-2" placeholder="Buscar practicante..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />

              <select className="border rounded-md px-3 py-2" value={areaFiltro} onChange={(e) => setAreaFiltro(e.target.value)}>
                {areas.map((area) => (
                  <option key={area} value={area}>{area === "Todas" ? "Todas las áreas" : area}</option>
                ))}
              </select>
            </div>

            {/* LISTA DE PRACTICANTES */}
            <div className="space-y-4">
              {loading ? (
                <div>Cargando practicantes...</div>
              ) : practicantesFiltrados.length === 0 ? (
                <div className="text-gray-500">No hay practicantes disponibles</div>
              ) : (
                practicantesFiltrados.map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-white border rounded-xl p-4 shadow-sm hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-semibold text-lg">
                        {p.nombre ? p.nombre[0].toUpperCase() : <User className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-semibold">{p.nombre}</p>
                        <p className="text-sm text-gray-500">{p.area}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">{p.habilidades?.map((h) => (
                          <span key={h} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">{h}</span>
                        ))}</div>
                      </div>
                    </div>

                    <button disabled={assigning} onClick={() => handleAssign(p)} className="flex items-center gap-2 border px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition">
                      <UserPlus className="w-4" />
                      {assigning ? 'Asignando...' : 'Asignar'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* PANEL DERECHO (SELECCIÓN DE PROYECTO) */}
          <div className="bg-white rounded-xl border shadow p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">Seleccionar Proyecto</h2>

            <select className="w-full border rounded-md px-3 py-2" value={proyectoSeleccionado} onChange={(e) => setProyectoSeleccionado(e.target.value)}>
              <option value="">Selecciona un proyecto</option>
              {proyectos.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>

          </div>
        </div>
      </main>
    </div>
  );
}
