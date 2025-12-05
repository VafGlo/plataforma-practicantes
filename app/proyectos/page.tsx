"use client";

import React from "react";
import { Sidebar } from "@/app/dashboard/components";
import { Eye, Pencil, Trash2 } from "lucide-react";

// 🔹 Datos de ejemplo (luego los reemplazamos por los de Supabase)
const proyectosMock = [
  {
    id: 1,
    nombre: "Proyecto Alpha",
    descripcion: "Desarrollo de plataforma de e-learning para capacitación corporativa",
    cliente: "Empresa Tech Corp",
    lider: "Juan Pérez",
    estado: "Activo",
    practicantes: ["AGI", "LHR"],
    cantidad: 2,
  },
  {
    id: 2,
    nombre: "Sistema de Inventario",
    descripcion: "Sistema integral de gestión de inventario y logística",
    cliente: "Retail Solutions SA",
    lider: "María López",
    estado: "Activo",
    practicantes: ["AGI", "CRL"],
    cantidad: 2,
  },
  {
    id: 3,
    nombre: "API Gateway",
    descripcion: "Gateway centralizado para microservicios empresariales",
    cliente: "Financial Services Inc",
    lider: "Carlos Ramírez",
    estado: "En pausa",
    practicantes: ["CRL", "DTC"],
    cantidad: 2,
  },
];

export default function ProyectosPage() {
  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENIDO */}
      <main className="flex-1 p-8 bg-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Proyectos</h1>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            + Nuevo Proyecto
          </button>
        </div>

        {/* Tabla */}
        <div className="bg-white shadow rounded-xl border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Proyecto</th>
                <th className="p-4 font-semibold text-gray-600">Cliente</th>
                <th className="p-4 font-semibold text-gray-600">Líder</th>
                <th className="p-4 font-semibold text-gray-600">Estado</th>
                <th className="p-4 font-semibold text-gray-600">Practicantes</th>
                <th className="p-4 font-semibold text-gray-600 text-center">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {proyectosMock.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  {/* Proyecto + descripción */}
                  <td className="p-4">
                    <p className="font-semibold">{p.nombre}</p>
                    <p className="text-sm text-gray-500">{p.descripcion}</p>
                  </td>

                  {/* Cliente */}
                  <td className="p-4">{p.cliente}</td>

                  {/* Líder */}
                  <td className="p-4">{p.lider}</td>

                  {/* Estado */}
                  <td className="p-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium 
                      ${
                        p.estado === "Activo"
                          ? "bg-black text-white"
                          : p.estado === "En pausa"
                          ? "bg-gray-300 text-gray-700"
                          : "bg-blue-200 text-blue-700"
                      }`}
                    >
                      {p.estado}
                    </span>
                  </td>

                  {/* Practicantes */}
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {p.practicantes.map((iniciales) => (
                        <span
                          key={iniciales}
                          className="bg-purple-200 text-purple-700 text-xs font-bold px-3 py-1 rounded-full"
                        >
                          {iniciales}
                        </span>
                      ))}
                      <span className="text-sm ml-2">{p.cantidad}</span>
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="p-4 text-center flex gap-3 justify-center">
                    <Eye className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-600" />
                    <Pencil className="w-5 h-5 text-gray-600 cursor-pointer hover:text-green-600" />
                    <Trash2 className="w-5 h-5 text-gray-600 cursor-pointer hover:text-red-600" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
