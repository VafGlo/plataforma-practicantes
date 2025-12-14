"use client";

import React, { useState } from "react";
import { Input } from "@/app/dashboard/components";
import { cn } from "@/lib/utils";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export function PracticantesFilters({
  busqueda,
  setBusqueda,
  filtroDisponibilidad, 
  setFiltroDisponibilidad, 
  filtroArea,
  setFiltroArea,
  filtroTecnologia,
  setFiltroTecnologia,
  total,
}: any) {
  
  //Opciones de area
  const areaOptions = [
    "Todas las áreas", 
    "Frontend",
    "Backend",
    "UX",
    "QA",
    "Mobile",
    "Fullstack",
  ];
  
  // Opciones de disponibilidad
  const disponibilidadOptions = ["Todas", "Disponible", "No disponible"];

  return (
    <div className="flex items-center space-x-4">
      {/* Buscador: 1er elemento */}
      <div className="relative flex-1 min-w-[200px]">
        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <input
          className="border border-gray-300 rounded-lg p-2 pl-10 w-full focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="Buscar por nombre o carrera..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Dropdown de Disponibilidad: 2do elemento */}
      <div className="min-w-[120px]">
        <select
          className="border border-gray-300 rounded-lg p-2 w-full text-sm appearance-none bg-white pr-8 focus:ring-blue-500 focus:border-blue-500"
          value={filtroDisponibilidad}
          onChange={(e) => setFiltroDisponibilidad(e.target.value)}
        >
          {disponibilidadOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Dropdown de Área: 3er elemento */}
      <div className="min-w-[120px]">
        <select
          className="border border-gray-300 rounded-lg p-2 w-full text-sm appearance-none bg-white pr-8 focus:ring-blue-500 focus:border-blue-500"
          value={filtroArea}
          onChange={(e) => setFiltroArea(e.target.value)}
        >
          {areaOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Input de Tecnología: 4to elemento */}
      <div className="relative flex-1 min-w-[150px]">
        <input
          className="border border-gray-300 rounded-lg p-2 w-full focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="Filtrar por tecnología..."
          value={filtroTecnologia}
          onChange={(e) => setFiltroTecnologia(e.target.value)}
        />
      </div>

  
    </div>
  );
}


// ----------------------------------------------------------
// TABLA LISTADO
// ----------------------------------------------------------

export function PracticantesTable({ practicantes, onDelete }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openDelete = (p: any) => {
    setSelected(p);
    setDeleteError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("practicantes").delete().eq("id", selected.id);
      if (error) {
        setDeleteError(error.message);
      } else {
        closeModal();
        if (onDelete) await onDelete();
      }
    } catch (err: any) {
      setDeleteError(err?.message ?? "Error al eliminar");
    } finally {
      setDeleting(false);
    }
  };
  
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
                                <div className="flex items-center">
                                    {/* Icono de Avatar (añadir aquí si lo tienes) */}
                                    <div className="mr-3 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-lg">
                                        {/* Podrías usar la primera letra del nombre, por ejemplo: */}
                                        {p.nombre ? p.nombre[0].toUpperCase() : ''} 
                                    </div>
                                    <div>
                                        <p className="font-medium">{p.nombre}</p>
                                        <p className="text-sm text-gray-500">{p.email}</p>
                                    </div>
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
                                <div className="flex flex-wrap gap-1 w-[150px]"> {/* Limitar un poco el ancho */}
                                    {p.tecnologias?.slice(0, 3).map((t: string, i: number) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 whitespace-nowrap"
                                        >
                                            {t}
                                        </span>
                                    ))}

                                    {p.tecnologias?.length > 3 && (
                                        <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700 whitespace-nowrap">
                                            +{p.tecnologias.length - 3}
                                        </span>
                                    )}
                                </div>
                            </td>

                            {/* Disponibilidad */}
                            <td className="px-4 py-4">
                                <span
                                    className={cn(
                                        "px-3 py-1 text-xs font-semibold rounded-lg", // Se cambió a rounded-lg y font-semibold para que se parezca más
                                        p.estado === "disponible"
                                            ? "bg-green-600 text-white" // Fondo sólido y texto blanco
                                            : "bg-red-600 text-white" // Fondo sólido y texto blanco
                                    )}
                                >
                                    {p.estado === "disponible" ? "Disponible" : "No disponible"}
                                </span>
                            </td>

                            {/* Acciones */}
                            <td className="px-4 py-4">
                                <div className="flex justify-center gap-3">
                                    <Link
                                      href={`/practicantes/${p.id}`}
                                      title="Ver detalles"
                                      className="text-gray-600 hover:text-gray-800 transition"
                                      aria-label={`Ver detalles de ${p.nombre}`}
                                    >
                                      <Eye className="w-5 h-5 cursor-pointer" />
                                    </Link>
                                    <Link
                                      href={`/practicantes/${p.id}/edit`}
                                      title="Editar practicante"
                                      className="text-blue-600 hover:text-blue-800 transition"
                                      aria-label={`Editar ${p.nombre}`}
                                    >
                                      <Pencil className="w-5 h-5 cursor-pointer" />
                                    </Link>
                                    <button onClick={() => openDelete(p)} aria-label={`Eliminar ${p.nombre}`}>
                                      <Trash2 className="w-5 h-5 text-red-600 cursor-pointer hover:text-red-800 transition" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {modalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
                <div className="bg-white rounded-xl shadow-lg p-6 z-10 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-2">Eliminar practicante</h3>
                  <p className="text-sm text-gray-600 mb-4">Estás a punto de eliminar al siguiente practicante:</p>
                  <div className="mb-4">
                    <p className="font-medium">{selected?.nombre}</p>
                    <p className="text-sm text-gray-500">{selected?.carrera} • {selected?.area}</p>
                  </div>
                  {deleteError && <p className="text-sm text-red-600 mb-2">Error: {deleteError}</p>}
                  <div className="flex justify-end gap-3">
                    <button onClick={closeModal} className="px-3 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">Cancelar</button>
                    <button onClick={confirmDelete} disabled={deleting} className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60">
                      {deleting ? "Eliminando..." : "Eliminar definitivamente"}
                    </button>
                  </div>
                </div>
              </div>
            )}
        </div>
    );
}