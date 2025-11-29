"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Sidebar,
  TopCards,
  AreasChart,
  DisponibilidadChart,
  QuickAccess,
} from "./components";

// Tipo de un practicante (ajusta los campos si tu tabla tiene más)
type Practicante = {
  id: string;
  nombre: string;
  area: string;
  estado: "disponible" | "asignado";
};

// Tipo de la data agregada por áreas
type AreaCount = {
  area: string;
  count: number;
};

export default function DashboardPage() {
  const supabase = createClient();

  const [areas, setAreas] = useState<AreaCount[]>([]);
  const [total, setTotal] = useState(0);
  const [disponibles, setDisponibles] = useState(0);
  const [asignados, setAsignados] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    // OBTENER TODOS LOS PRACTICANTES
    const { data: practicantes } = await supabase
      .from("practicantes")
      .select("*");

    if (!practicantes) return;

    // Tipar la respuesta explícitamente
    const items: Practicante[] = practicantes as unknown as Practicante[];

    setTotal(items.length);

    // Contar disponibles / asignados (aquí corregimos el error)
    setDisponibles(
      items.filter((p: Practicante) => p.estado === "disponible").length
    );

    setAsignados(
      items.filter((p: Practicante) => p.estado === "asignado").length
    );

    // Agrupar por área
    const areaMap: Record<string, number> = {};

    items.forEach((p: Practicante) => {
      areaMap[p.area] = (areaMap[p.area] || 0) + 1;
    });

    const formatted: AreaCount[] = Object.entries(areaMap).map(
      ([area, count]) => ({
        area,
        count,
      })
    );

    setAreas(formatted);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 bg-[#F1F5F9]">
        <TopCards
          total={total}
          disponibles={disponibles}
          asignados={asignados}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <AreasChart data={areas} />
          <DisponibilidadChart
            disponibles={disponibles}
            asignados={asignados}
          />
        </div>

        <QuickAccess />
      </main>
    </div>
  );
}



// // app/dashboard/page.tsx
// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "../../providers/AuthProvider";

// export default function DashboardPage() {
//   const router = useRouter();
//   const { user, loading } = useAuth();

//   useEffect(() => {
//     if (!loading && !user) {
//       router.replace("/auth/login");
//     }
//   }, [user, loading, router]);

//   if (loading || !user) {
//     return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-[#F7F8FA] flex">
//       {/* Sidebar + main (puedes usar el layout que te pasé antes) */}
//       <aside className="w-64 bg-white border-r p-6 flex flex-col">
//         <h1 className="text-xl font-bold mb-10">PracticeHub</h1>
//         <nav className="space-y-3">
//           <a className="block p-2 rounded-lg bg-blue-50 text-blue-600 font-medium">Dashboard</a>
//           <a className="block p-2 rounded-lg hover:bg-gray-100">Practicantes</a>
//           <a className="block p-2 rounded-lg hover:bg-gray-100">Proyectos</a>
//         </nav>

//         <div className="mt-auto pt-10 text-sm text-gray-600">
//           <p className="font-semibold">{user.email}</p>
//         </div>
//       </aside>

//       <main className="flex-1 p-8">
//         <h2 className="text-2xl font-semibold">Dashboard</h2>
//         <p className="text-gray-500 mb-6">Bienvenido al panel de administración</p>

//         {/* Aquí irán tus cards dinámicas */}
//       </main>
//     </div>
//   );
// }
