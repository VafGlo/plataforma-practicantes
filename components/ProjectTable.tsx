"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

type Proyecto = {
  id: number;
  nombre: string;
  descripcion: string;
  cliente: string;
  lider: string;
  estado: string;
  practicantes: string[];
};

export default function ProjectTable({ proyectos }: { proyectos: Proyecto[] }) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 text-gray-600 text-left">
        <tr>
          <th className="py-3 px-4">Proyecto</th>
          <th className="py-3 px-4">Cliente</th>
          <th className="py-3 px-4">Líder</th>
          <th className="py-3 px-4">Estado</th>
        </tr>
      </thead>

      <tbody>
        {proyectos.map((p) => (
          <tr
            key={p.id}
            className="border-b last:border-none hover:bg-gray-50 transition"
          >
            {/* Proyecto */}
            <td className="py-4 px-4">
              <div className="font-medium">{p.nombre}</div>
              <div className="text-gray-500 text-xs">{p.descripcion}</div>
            </td>

            {/* Cliente */}
            <td className="py-4 px-4">{p.cliente}</td>

            {/* Líder */}
            <td className="py-4 px-4">{p.lider}</td>

            {/* Estado */}
            <td className="py-4 px-4">
              <span
                className={`
                  text-xs px-3 py-1 rounded-full
                  ${
                    p.estado === "Activo"
                      ? "bg-black text-white"
                      : p.estado === "En pausa"
                      ? "bg-gray-200 text-gray-700"
                      : "bg-green-100 text-green-700"
                  }
                `}
              >
                {p.estado}
              </span>
            </td>

            {/* Practicantes */}
            <td className="py-4 px-4">
              <div className="flex gap-2 items-center">
                {p.practicantes.slice(0, 2).map((ini, i) => (
                  <span
                    key={i}
                    className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium"
                  >
                    {ini}
                  </span>
                ))}

                {p.practicantes.length > 2 && (
                  <span className="text-xs text-gray-600">
                    +{p.practicantes.length - 2}
                  </span>
                )}
              </div>
            </td>

            {/* Acciones */}
            <td className="py-4 px-4 text-center flex gap-4 justify-center">
              <Eye className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
              <Pencil className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer" />
              <Trash2 className="w-5 h-5 text-gray-600 hover:text-red-600 cursor-pointer" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
