"use client";

import React, { useState } from "react";
import { Sidebar } from "@/app/dashboard/components";
import { UserPlus } from "lucide-react";

const practicantesMock = [
  {
    id: 1,
    nombre: "Ana García Martínez",
    area: "Fullstack",
    foto: "https://randomuser.me/api/portraits/women/44.jpg",
    habilidades: ["React", "TypeScript", "Node.js"],
  },
  {
    id: 2,
    nombre: "María Fernández Torres",
    area: "UX",
    foto: "https://randomuser.me/api/portraits/women/68.jpg",
    habilidades: ["Figma", "Adobe XD", "Sketch"],
  },
  {
    id: 3,
    nombre: "Luis Hernández Ruiz",
    area: "Frontend",
    foto: "https://randomuser.me/api/portraits/men/32.jpg",
    habilidades: ["Vue.js", "JavaScript", "Sass"],
  },
  {
    id: 4,
    nombre: "Roberto Sánchez Díaz",
    area: "Mobile",
    foto: "https://randomuser.me/api/portraits/men/11.jpg",
    habilidades: ["React Native", "Swift", "Kotlin"],
  },
  {
    id: 5,
    nombre: "Laura Martínez Pérez",
    area: "Frontend",
    foto: "https://randomuser.me/api/portraits/women/51.jpg",
    habilidades: ["Angular", "TypeScript", "RxJS"],
  },
];

const proyectosMock = [
  { id: 1, nombre: "Proyecto Alpha" },
  { id: 2, nombre: "Sistema de Inventario" },
  { id: 3, nombre: "API Gateway" },
  { id: 4, nombre: "App Delivery" },
];

export default function AsignacionesPage() {
  const [busqueda, setBusqueda] = useState("");
  const [areaFiltro, setAreaFiltro] = useState("Todas");
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState("");

  const areas = ["Todas", "Fullstack", "Frontend", "UX", "Mobile"];

  const practicantesFiltrados = practicantesMock.filter((p) => {
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchArea = areaFiltro === "Todas" || p.area === areaFiltro;
    return matchBusqueda && matchArea;
  });

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-bold mb-2">Asignación de Practicantes</h1>
        <p className="text-gray-600 mb-8">
          Asigna practicantes disponibles a proyectos activos
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* PANEL IZQUIERDO (LISTA DE PRACTICANTES) */}
          <div className="lg:col-span-2 bg-white rounded-xl border shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Practicantes Disponibles</h2>

            {/* BÚSQUEDA Y FILTRO */}
            <div className="flex gap-4 mb-6">
              <input
                className="flex-1 border rounded-md px-3 py-2"
                placeholder="Buscar practicante..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              <select
                className="border rounded-md px-3 py-2"
                value={areaFiltro}
                onChange={(e) => setAreaFiltro(e.target.value)}
              >
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area === "Todas" ? "Todas las áreas" : area}
                  </option>
                ))}
              </select>
            </div>

            {/* LISTA DE PRACTICANTES */}
            <div className="space-y-4">
              {practicantesFiltrados.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between bg-white border rounded-xl p-4 shadow-sm hover:bg-gray-50"
                >
                  {/* Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={p.foto}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{p.nombre}</p>
                      <p className="text-sm text-gray-500">{p.area}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {p.habilidades.map((h) => (
                          <span
                            key={h}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Botón asignar */}
                  <button
                    className="flex items-center gap-2 border px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition"
                  >
                    <UserPlus className="w-4" />
                    Asignar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* PANEL DERECHO (SELECCIÓN DE PROYECTO) */}
          <div className="bg-white rounded-xl border shadow p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">Seleccionar Proyecto</h2>

            <select
              className="w-full border rounded-md px-3 py-2"
              value={proyectoSeleccionado}
              onChange={(e) => setProyectoSeleccionado(e.target.value)}
            >
              <option value="">Selecciona un proyecto</option>
              {proyectosMock.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

        </div>
      </main>
    </div>
  );
}
