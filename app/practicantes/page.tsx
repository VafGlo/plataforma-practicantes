"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/app/dashboard/components";
import { createClient } from "@/utils/supabase/client";
import ImportCSV from "@/app/practicantes/ImportCSV";
import ImportPDF from "@/app/practicantes/ImportPDF";
import { PracticantesFilters, PracticantesTable } from "./components";

type Practicante = {
  id: string;
  nombre: string;
  carrera: string;
  email: string;
  area: string;
  tecnologias: string[];
  estado: "disponible" | "asignado"; // 'asignado' implica 'No disponible'
};

// Mapeo de estado para la interfaz (disponible/no disponible)
const getDisponibilidad = (
  estado: "disponible" | "asignado"
): "Disponible" | "No disponible" => {
  return estado === "disponible" ? "Disponible" : "No disponible";
};

export default function PracticantesPage() {
  const supabase = createClient();

  // Los estados de filtro deben coincidir con las opciones de los dropdowns
  const [practicantes, setPracticantes] = useState<Practicante[]>([]);
  const [busqueda, setBusqueda] = useState("");
  // Estado para el primer dropdown (Disponibilidad: Todas / Disponible / No disponible)
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState("Todas");
  // Estado para el segundo dropdown (Área: Todas las áreas / Frontend / Backend, etc.)
  const [filtroArea, setFiltroArea] = useState("Todas las áreas");
  const [filtroTecnologia, setFiltroTecnologia] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPracticantes();
  }, []);

  const loadPracticantes = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supaError } = await supabase
        .from("practicantes")
        .select("id, nombre, carrera, email, area, tecnologias, estado")
        .order("nombre", { ascending: true });

      if (supaError) {
        // ... (Manejo de error)
        console.error("Supabase error:", supaError);
        setError(supaError.message);
        setPracticantes([]);
        setLoading(false);
        return;
      }

      if (!data) {
        // ... (Manejo de datos vacíos)
        setPracticantes([]);
        setLoading(false);
        return;
      }

      // También cargar proyectos para determinar disponibilidad real
      const { data: proyectos } = await supabase
        .from("proyectos")
        .select("id,nombre,practicantes");
      const assignedSet = new Set<string>();
      (proyectos || []).forEach((proj: any) => {
        let arr: any[] = [];
        if (Array.isArray(proj.practicantes)) arr = proj.practicantes;
        else if (typeof proj.practicantes === "string") {
          try {
            arr = JSON.parse(proj.practicantes);
          } catch {
            arr = [];
          }
        }
        arr.forEach((x: any) => assignedSet.add(String(x)));
      });

      const formatted = (data as any[]).map((p) => {
        let techs: string[] = [];
        // ... (Lógica de normalización de tecnologías)
        if (Array.isArray(p.tecnologias)) {
          techs = p.tecnologias;
        } else if (typeof p.tecnologias === "string") {
          try {
            const parsed = JSON.parse(p.tecnologias);
            techs = Array.isArray(parsed) ? parsed : [];
          } catch {
            techs = p.tecnologias
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean);
          }
        } else {
          techs = [];
        }

        const isAssigned =
          assignedSet.has(String(p.id)) || assignedSet.has(String(p.nombre));

        return {
          id: p.id,
          nombre: p.nombre ?? "",
          carrera: p.carrera ?? "",
          email: p.email ?? "",
          area: p.area ?? "",
          tecnologias: techs,
          // Priorizar asignación por proyectos; si está en un proyecto => 'asignado'
          estado: isAssigned
            ? "asignado"
            : p.estado === "asignado"
            ? "asignado"
            : "disponible",
        } as Practicante;
      });

      setPracticantes(formatted);
      setLoading(false);
    } catch (err: any) {
      console.error("Error cargando practicantes:", err);
      setError(err?.message ?? "Error desconocido");
      setLoading(false);
    }
  };

  // FILTRADO LOCAL -------------------------------------------
  const filtered = practicantes.filter((p) => {
    const matchSearch =
      busqueda === "" ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.carrera.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.email.toLowerCase().includes(busqueda.toLowerCase());

    // Filtro por Área
    const matchArea = filtroArea === "Todas las áreas" || p.area === filtroArea;

    // Filtro por Disponibilidad
    const currentDisponibilidad = getDisponibilidad(p.estado);
    const matchDisponibilidad =
      filtroDisponibilidad === "Todas" ||
      filtroDisponibilidad === currentDisponibilidad;

    // Filtro por Tecnología
    const matchTech =
      filtroTecnologia === "" ||
      p.tecnologias.some((t) =>
        t.toLowerCase().includes(filtroTecnologia.toLowerCase())
      );

    return matchSearch && matchArea && matchTech && matchDisponibilidad;
  });

  return (
    <div className="flex h-screen w-full bg-gray-50 text-gray-900">
      {/* Sidebar izquierdo (Asegúrate de que el Sidebar maneje el contraste oscuro/claro) */}
      <Sidebar />

      {/* Contenido principal con scroll */}
      <div className="flex-1 flex flex-col overflow-auto bg-white">
        {/* === HEADER SUPERIOR CON BOTÓN NUEVO PRACTICANTE === */}
        <div className="flex justify-between items-center p-8 pb-0 bg-white z-10">
          <div>
            <h1 className="text-3xl font-semibold mb-1">Practicantes</h1>
            <p className="text-gray-500">Gestiona el listado de practicantes</p>
          </div>

          <div className="flex gap-3">
            <ImportCSV onSuccess={loadPracticantes} />
            <ImportPDF practicantes={filtered} />
          </div>

          <a
            href="/practicantes/new"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 shadow-md"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            <span>Nuevo Practicante</span>
          </a>
        </div>
        {/* ================================================= */}

        {/* Contenedor del listado y filtros */}
        <div className="p-8 pt-6">
          {loading ? (
            <div className="py-8">Cargando practicantes...</div>
          ) : error ? (
            <div className="py-4 text-red-600">Error: {error}</div>
          ) : (
            <>
              {/* Contenedor de filtros con el estilo de tarjeta (card) - Fondo blanco y sombra sutil */}
              <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-100">
                <h3 className="text-lg font-medium mb-4 text-gray-700 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v5.186a1 1 0 01-1.293.93l-2-0.5A1 1 0 018 18v-5.186a1 1 0 00-.293-.707L4.293 7.293A1 1 0 014 6.586V4z"
                    ></path>
                  </svg>
                  Filtros Avanzados
                </h3>
                {/* 
                  El componente PracticantesFilters debe implementar la UI de los 4 campos en línea. 
                */}
                <PracticantesFilters
                  busqueda={busqueda}
                  setBusqueda={setBusqueda}
                  // Filtro 1: Disponibilidad
                  filtroDisponibilidad={filtroDisponibilidad}
                  setFiltroDisponibilidad={setFiltroDisponibilidad}
                  // Filtro 2: Área (Nombre de prop mantenido, pero ahora representa el filtro del dropdown)
                  filtroArea={filtroArea}
                  setFiltroArea={setFiltroArea}
                  // Filtro 3: Tecnología
                  filtroTecnologia={filtroTecnologia}
                  setFiltroTecnologia={setFiltroTecnologia}
                  total={filtered.length}
                />
              </div>

              {/* Mensaje de conteo */}
              <p className="text-gray-500 mb-4 ml-1">
                Mostrando **{filtered.length}** de {practicantes.length}{" "}
                practicantes
              </p>

              {/* Tabla de Practicantes */}
              <PracticantesTable
                practicantes={filtered}
                onDelete={loadPracticantes}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
