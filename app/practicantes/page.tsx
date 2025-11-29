"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    loadPracticantes();
  }, []);

  const loadPracticantes = async () => {
    const { data } = await supabase.from("practicantes").select("*");
    if (!data) return;

    const formatted = data.map((p) => ({
      ...p,
      tecnologias: p.tecnologias ?? [],
    })) as Practicante[];

    setPracticantes(formatted);
  };

  // FILTRADO LOCAL -------------------------------------------
  const filtered = practicantes.filter((p) => {
    const matchSearch =
      busqueda === "" ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.carrera.toLowerCase().includes(busqueda.toLowerCase());

    const matchArea = filtroArea === "Todas" || p.area === filtroArea;
    const matchTech =
      filtroTecnologia === "" ||
      p.tecnologias.some((t) =>
        t.toLowerCase().includes(filtroTecnologia.toLowerCase())
      );

    return matchSearch && matchArea && matchTech;
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-1">Practicantes</h1>
      <p className="text-gray-500 mb-6">
        Gestiona el listado de practicantes
      </p>

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
    </div>
  );
}
