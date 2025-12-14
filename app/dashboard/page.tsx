"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Sidebar } from "./components"; // tu Sidebar existente
import { Users, CheckCircle, Box } from "lucide-react"; // opcional para iconos

type Practicante = {
  id: string;
  nombre?: string;
  area?: string;
  estado?: "disponible" | "asignado";
};

type AreaCount = {
  area: string;
  count: number;
};

export default function DashboardPage() {
  const supabase = createClient();

  const [areas, setAreas] = useState<AreaCount[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [disponibles, setDisponibles] = useState<number>(0);
  const [asignados, setAsignados] = useState<number>(0);
  const [totalProjects, setTotalProjects] = useState<number>(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const { data: practicantes } = await supabase
        .from("practicantes")
        .select("id,nombre,area,estado");

      const { data: proyectos } = await supabase.from("proyectos").select("id,nombre,practicantes");

      // Construir set de practicantes asignados desde proyectos
      const assignedSet = new Set<string>();
      (proyectos || []).forEach((proj: any) => {
        let arr: any[] = [];
        if (Array.isArray(proj.practicantes)) arr = proj.practicantes;
        else if (typeof proj.practicantes === "string") {
          try { arr = JSON.parse(proj.practicantes); } catch { arr = []; }
        }
        arr.forEach((x: any) => assignedSet.add(String(x)));
      });

      setTotalProjects((proyectos || []).length);

      if (!practicantes) {
        setTotal(0);
        setDisponibles(0);
        setAsignados(0);
        setAreas([]);
        return;
      }

      const items = (practicantes as unknown as Practicante[]) || [];

      setTotal(items.length);
      // Calcular asignados comprobando assignedSet (por id o por nombre en caso de que la tabla guarde nombres)
      const assignedCount = items.filter((p) => assignedSet.has(String(p.id)) || (p.nombre && assignedSet.has(String(p.nombre)))).length;
      setAsignados(assignedCount);
      setDisponibles(items.length - assignedCount);

      // agrupar por area
      const map: Record<string, number> = {};
      items.forEach((p) => {
        const a = p.area ?? "Sin especificar";
        map[a] = (map[a] || 0) + 1;
      });

      const formatted: AreaCount[] = Object.entries(map).map(
        ([area, count]) => ({ area, count })
      );
      setAreas(formatted);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    }
  };

  const porcentajeDisponible =
    disponibles + asignados === 0
      ? 0
      : Math.round((disponibles / (disponibles + asignados)) * 100);

  // Colores para las barras por área (puedes ajustar)
  const areaColors = [
    "#2B6CB0", // azul
    "#7C3AED", // morado
    "#06B6D4", // cyan
    "#10B981", // verde
    "#F59E0B", // naranja
    "#EF4444", // rojo
  ];

  return (
    <div className="flex min-h-screen bg-[#F7F9FB]">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Bienvenido al panel de administración</p>
        </div>

        {/* Top stats - 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Practicantes</p>
                <p className="mt-3 text-3xl font-bold text-gray-800">{total}</p>
                <p className="text-xs text-gray-400 mt-2">Registrados en sistema</p>
              </div>
              <div className="text-indigo-500 bg-indigo-50 rounded-lg p-2">
                <Users size={20} />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Disponibles</p>
                <p className="mt-3 text-3xl font-bold text-green-600">{disponibles}</p>
                <p className="text-xs text-gray-400 mt-2">Listos para asignar</p>
              </div>
              <div className="text-green-500 bg-green-50 rounded-lg p-2">
                <CheckCircle size={20} />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Asignados</p>
                <p className="mt-3 text-3xl font-bold text-purple-600">{asignados}</p>
                <p className="text-xs text-gray-400 mt-2">En proyectos activos</p>
              </div>
              <div className="text-purple-500 bg-purple-50 rounded-lg p-2">
                {/* icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v20" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Proyectos</p>
                  <p className="mt-3 text-3xl font-bold text-indigo-600">{totalProjects}</p>
                <p className="text-xs text-gray-400 mt-2">Proyectos gestionados</p>
              </div>
              <div className="text-indigo-500 bg-indigo-50 rounded-lg p-2">
                <Box size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
          {/* Areas chart card */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="text-gray-700 font-semibold mb-4">Practicantes por Área</h3>

            <div className="space-y-4">
              {areas.length === 0 ? (
                <div className="text-gray-400">No hay datos por el momento</div>
              ) : (
                areas.map((row, i) => {
                  const pct = Math.min(100, Math.round((row.count / Math.max(1, total)) * 100));
                  return (
                    <div key={row.area} className="flex items-center justify-between">
                      <div className="w-2/5">
                        <p className="text-sm text-gray-700">{row.area}</p>
                      </div>

                      <div className="flex-1 px-4">
                        <div className="w-full bg-gray-100 h-3 rounded-full">
                          <div
                            className="h-3 rounded-full"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: areaColors[i % areaColors.length],
                            }}
                          />
                        </div>
                      </div>

                      <div className="w-12 text-right">
                        <span className="text-sm text-gray-600">{row.count}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Disponibilidad donut */}
          <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col">
            <h3 className="text-gray-700 font-semibold mb-4">Disponibilidad de Practicantes</h3>

            <div className="flex-1 flex items-center justify-center">
              {/* Donut SVG */}
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E6E7E9"
                    strokeWidth="4.5"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="4.5"
                    strokeDasharray={`${porcentajeDisponible} ${100 - porcentajeDisponible}`}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-xl font-semibold text-gray-700">{porcentajeDisponible}%</div>
                  <div className="text-sm text-gray-500">Disponibles</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-4 justify-between px-2">
              <div className="flex-1 bg-green-50 rounded-lg py-3 text-center">
                <div className="text-green-600 font-semibold">{disponibles}</div>
                <div className="text-xs text-gray-600">Disponibles</div>
              </div>

              <div className="flex-1 bg-purple-50 rounded-lg py-3 text-center">
                <div className="text-purple-600 font-semibold">{asignados}</div>
                <div className="text-xs text-gray-600">Asignados</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}