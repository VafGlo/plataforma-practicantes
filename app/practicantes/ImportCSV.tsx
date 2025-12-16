"use client";

import { useState } from "react";
import Papa from "papaparse";
import { createClient } from "@/utils/supabase/client";

type ImportCSVProps = {
  onSuccess?: () => void | Promise<void>;
};

export default function ImportCSV({ onSuccess }: ImportCSVProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setLoading(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rows = results.data as any[];

          const formatted = rows.map((row) => ({
            nombre: row.nombre?.trim(),
            apellido: row.apellido?.trim(),
            email: row.email?.trim(),
            telefono: row.tlefono?.trim(),
            carrera: row.carrera?.trim(),
            semestre:
              row.semestre && row.semestre.trim() !== ""
                ? Number(row.semestre)
                : null,
            area: row.area?.trim(),
            tecnologias: row.tecnologias
              ? row.tecnologias.split(",").map((t: string) => t.trim())
              : [],
            estado: row.estado === "asignado" ? "asignado" : "disponible",
          }));

          const { error } = await supabase
            .from("practicantes")
            .insert(formatted);

          if (error) throw error;

          if (onSuccess) await onSuccess();
        } catch (err: any) {
          console.error(err);
          setError(err.message || "Error al importar CSV");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div>
      <label className="cursor-pointer bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800">
        {loading ? "Importando..." : "Importar CSV"}
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />
      </label>

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
