"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/app/dashboard/components";
import { createClient } from "@/utils/supabase/client";
import {
  PracticantesFilters,
  PracticantesTable,
} from "./components";

type Practicante = {
  id: string;
  nombre: string;
  carrera: string;
  email: string;
  area: string;
  tecnologias: string[];
  estado: "disponible" | "asignado";
};

export default function PracticantesPage() {
  const supabase = createClient();

  const [practicantes, setPracticantes] = useState<Practicante[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroArea, setFiltroArea] = useState("Todas");
  const [filtroTecnologia, setFiltroTecnologia] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPracticantes();
    // opcional: podrías suscribirte a cambios en la tabla para realtime aquí
  }, []);

  const loadPracticantes = async () => {
    setLoading(true);
    setError(null);

    try {
      // selecciona las columnas explícitas para evitar problemas de tipos
      const { data, error: supaError } = await supabase
        .from("practicantes")
        .select("id, nombre, carrera, email, area, tecnologias, estado")
        .order("nombre", { ascending: true });

      if (supaError) {
        console.error("Supabase error:", supaError);
        setError(supaError.message);
        setPracticantes([]);
        setLoading(false);
        return;
      }

      if (!data) {
        setPracticantes([]);
        setLoading(false);
        return;
      }

      // Normalizar formatos: tecnologias puede venir como array JSON, string JSON o null
      const formatted = (data as any[]).map((p) => {
        let techs: string[] = [];

        if (Array.isArray(p.tecnologias)) {
          techs = p.tecnologias;
        } else if (typeof p.tecnologias === "string") {
          try {
            const parsed = JSON.parse(p.tecnologias);
            techs = Array.isArray(parsed) ? parsed : [];
          } catch {
            // si no es JSON, intentar split por comas
            techs = p.tecnologias.split(",").map((s: string) => s.trim()).filter(Boolean);
          }
        } else {
          techs = [];
        }

        return {
          id: p.id,
          nombre: p.nombre ?? "",
          carrera: p.carrera ?? "",
          email: p.email ?? "",
          area: p.area ?? "",
          tecnologias: techs,
          estado: p.estado === "asignado" ? "asignado" : "disponible",
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

    const matchArea = filtroArea === "Todas" || p.area === filtroArea;
    const matchTech =
      filtroTecnologia === "" ||
      p.tecnologias.some((t) =>
        t.toLowerCase().includes(filtroTecnologia.toLowerCase())
      );

    return matchSearch && matchArea && matchTech;
  });

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar izquierdo */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-semibold mb-1">Practicantes</h1>
        <p className="text-gray-500 mb-6">Gestiona el listado de practicantes</p>

        {loading ? (
          <div className="py-8">Cargando practicantes...</div>
        ) : error ? (
          <div className="py-4 text-red-600">Error: {error}</div>
        ) : (
          <>
            <PracticantesFilters
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              filtroArea={filtroArea}
              setFiltroArea={setFiltroArea}
              filtroTecnologia={filtroTecnologia}
              setFiltroTecnologia={setFiltroTecnologia}
              total={filtered.length}
            />

            <PracticantesTable practicantes={filtered} />
          </>
        )}
      </div>
    </div>
  );
}