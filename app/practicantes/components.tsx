"use client";

import { Input } from "@/app/dashboard/components";
import { cn } from "@/lib/utils";
import { Eye, Pencil, Trash2 } from "lucide-react";

export function PracticantesFilters({
  busqueda,
  setBusqueda,
  filtroArea,
  setFiltroArea,
  filtroTecnologia,
  setFiltroTecnologia,
  total,
}: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow mb-6 border">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-gray-700 font-medium">Filtros Avanzados</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Buscador */}
        <Input
          placeholder="Buscar por nombre o carrera..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {/* Filtro área */}
        <select
          className="border rounded-md p-2"
          value={filtroArea}
          onChange={(e) => setFiltroArea(e.target.value)}
        >
          <option>Todas</option>
          <option>Frontend</option>
          <option>Backend</option>
          <option>UX</option>
          <option>QA</option>
          <option>Mobile</option>
          <option>Fullstack</option>
        </select>

        {/* Filtro tecnologías */}
        <Input
          placeholder="Filtrar por tecnología..."
          value={filtroTecnologia}
          onChange={(e) => setFiltroTecnologia(e.target.value)}
        />

        {/* Mostrar conteo */}
        <div className="text-sm text-gray-600 flex items-center">
          Mostrando <b className="mx-1">{total}</b> practicantes
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------
// TABLA LISTADO
// ----------------------------------------------------------

export function PracticantesTable({ practicantes }: any) {
  return (
    <div className="bg-white rounded-xl shadow border overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 text-left text-sm text-gray-600">
          <tr>
            <th className="px-4 py-3">Practicante</th>
            <th className="px-4 py-3">Carrera</th>
            <th className="px-4 py-3">Área</th>
            <th className="px-4 py-3">Tecnologías</th>
            <th className="px-4 py-3">Disponibilidad</th>
            <th className="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {practicantes.map((p: any) => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              {/* Practicante */}
              <td className="px-4 py-4">
                <div>
                  <p className="font-medium">{p.nombre}</p>
                  <p className="text-sm text-gray-500">{p.email}</p>
                </div>
              </td>

              {/* Carrera */}
              <td className="px-4 py-4 text-gray-700">{p.carrera}</td>

              {/* Área */}
              <td className="px-4 py-4">
                <span className="px-2 py-1 text-xs rounded-full bg-slate-200 text-slate-700">
                  {p.area}
                </span>
              </td>

              {/* Tecnologías */}
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-1">
                  {p.tecnologias?.slice(0, 3).map((t: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                    >
                      {t}
                    </span>
                  ))}

                  {p.tecnologias?.length > 3 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
                      +{p.tecnologias.length - 3}
                    </span>
                  )}
                </div>
              </td>

              {/* Disponibilidad */}
              <td className="px-4 py-4">
                <span
                  className={cn(
                    "px-2 py-1 text-xs rounded-full",
                    p.estado === "disponible"
                      ? "bg-green-200 text-green-700"
                      : "bg-red-200 text-red-700"
                  )}
                >
                  {p.estado === "disponible" ? "Disponible" : "No disponible"}
                </span>
              </td>

              {/* Acciones */}
              <td className="px-4 py-4">
                <div className="flex justify-center gap-3">
                  <Eye className="w-5 h-5 text-gray-600 cursor-pointer" />
                  <Pencil className="w-5 h-5 text-blue-600 cursor-pointer" />
                  <Trash2 className="w-5 h-5 text-red-600 cursor-pointer" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
