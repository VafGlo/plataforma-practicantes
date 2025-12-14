"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function ProyectosTable({ proyectos, onDelete, practicantesList = [] }: any) {
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
      const { error } = await supabase.from("proyectos").delete().eq("id", selected.id);
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
    <div className="bg-white shadow rounded-xl border overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 font-semibold text-gray-600">Proyecto</th>
            <th className="p-4 font-semibold text-gray-600">Cliente</th>
            <th className="p-4 font-semibold text-gray-600">Líder</th>
            <th className="p-4 font-semibold text-gray-600">Estado</th>
            <th className="p-4 font-semibold text-gray-600">Practicantes</th>
            <th className="p-4 font-semibold text-gray-600 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {proyectos.map((p: any) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-4">
                <p className="font-semibold">{p.nombre}</p>
                <p className="text-sm text-gray-500">{p.descripcion}</p>
              </td>
              <td className="p-4">{p.cliente}</td>
              <td className="p-4">{p.lider}</td>
              <td className="p-4">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${p.estado === "Activo" ? "bg-black text-white" : p.estado === "En pausa" ? "bg-gray-300 text-gray-700" : "bg-blue-200 text-blue-700"}`}>
                  {p.estado}
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  {(p.practicantes || []).map((pr: any, i: number) => {
                    // pr puede ser id o nombre; intentar resolver por id
                    const found = practicantesList.find((x: any) => x.id === pr || x.id === String(pr));
                    const label = found ? (found.nombre || found.email || found.id) : String(pr);
                    // Mostrar iniciales o nombre corto
                    const initials = label.split(" ").map((s: string) => s[0]).join("").slice(0, 2).toUpperCase();
                    return (
                      <span key={i} title={label} className="bg-purple-200 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
                        {initials}
                      </span>
                    );
                  })}
                  <span className="text-sm ml-2">{(p.practicantes || []).length}</span>
                </div>
              </td>
              <td className="p-4 text-center flex gap-3 justify-center">
                <Link href={`/proyectos/${p.id}`} aria-label={`Ver proyecto ${p.nombre}`} className="text-gray-600 hover:text-blue-600">
                  <Eye className="w-5 h-5 cursor-pointer" />
                </Link>
                <Link href={`/proyectos/${p.id}/edit`} aria-label={`Editar proyecto ${p.nombre}`} className="text-gray-600 hover:text-green-600">
                  <Pencil className="w-5 h-5 cursor-pointer" />
                </Link>
                <button onClick={() => openDelete(p)} aria-label={`Eliminar proyecto ${p.nombre}`}>
                  <Trash2 className="w-5 h-5 text-gray-600 cursor-pointer hover:text-red-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="bg-white rounded-xl shadow-lg p-6 z-10 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Eliminar proyecto</h3>
            <p className="text-sm text-gray-600 mb-4">Estás a punto de eliminar el siguiente proyecto:</p>
            <div className="mb-4">
              <p className="font-medium">{selected?.nombre}</p>
              <p className="text-sm text-gray-500">{selected?.cliente} • {selected?.lider}</p>
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

export default ProyectosTable;
