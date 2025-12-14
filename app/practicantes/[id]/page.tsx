// app/dashboard/practicantes/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/app/dashboard/components";
import { createClient } from "@/utils/supabase/client";
import { ChevronLeft, Edit, Trash2, Mail, Phone, ExternalLink } from "lucide-react";
import Image from "next/image"; 
import Link from "next/link";

// Define la estructura de datos extendida
type PracticanteDetalle = {
  id: string;
  nombre: string;
  carrera: string;
  email: string;
  area: string;
  descripcion: string; 
  telefono: string;
  portafolio_url: string;
  tecnologias: string[];
  soft_skills: string[];
  proyectos: string[]; 
  estado: "disponible" | "asignado";
  foto_url: string; 
};

// Componente para la pastilla de estado
const EstadoBadge = ({ estado }: { estado: 'disponible' | 'asignado' }) => {
  const isDisponible = estado === 'disponible';
  const text = isDisponible ? "Disponible" : "No disponible";
  const className = isDisponible 
    ? "bg-green-600 text-white font-semibold px-3 py-1 rounded-lg text-sm" 
    : "bg-red-600 text-white font-semibold px-3 py-1 rounded-lg text-sm";
  
  return <span className={className}>{text}</span>;
};

// Componente principal de la página de detalle
export default function PracticanteDetallePage({ params }: { params: { id: string } }) {
  const { id } = params;
  // createClient viene de "@/utils/supabase/client"
  const supabase = createClient();
  const [practicante, setPracticante] = useState<PracticanteDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPracticante = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: supaError } = await supabase
          .from("practicantes")
          .select("id, nombre, carrera, email, area, tecnologias, estado, descripcion, telefono, portafolio_url, soft_skills, proyectos, foto_url")
          .eq("id", id) 
          .single();
          
        if (supaError || !data) {
          setError(supaError?.message || "Practicante no encontrado.");
          setPracticante(null);
        } else {
          // Normalización de datos y valores de mock
          const formattedData: PracticanteDetalle = {
            ...data as any,
            tecnologias: Array.isArray(data.tecnologias) ? data.tecnologias : JSON.parse(data.tecnologias || '[]'),
            soft_skills: Array.isArray(data.soft_skills) ? data.soft_skills : JSON.parse(data.soft_skills || '[]'),
            proyectos: Array.isArray(data.proyectos) ? data.proyectos : JSON.parse(data.proyectos || '[]'),
            
            foto_url: data.foto_url || "https://randomuser.me/api/portraits/women/44.jpg", 
            descripcion: data.descripcion || "Desarrolladora fullstack con experiencia en aplicaciones web modernas. Apasionada por crear interfaces de usuario intuitivas y APIs escalables.", 
            telefono: data.telefono || "+52 555 123 4567", 
            portafolio_url: data.portafolio_url || "https://portafolio.ejemplo.com", 
          };
          setPracticante(formattedData);
        }
      } catch (err) {
        console.error("Error cargando detalle del practicante:", err);
        setError("Error desconocido al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPracticante();
    }
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="flex h-screen w-full bg-gray-50 text-gray-900">
        <Sidebar />
        <div className="flex-1 p-8">Cargando detalles del practicante...</div>
      </div>
    );
  }

  if (error || !practicante) {
    return (
      <div className="flex h-screen w-full bg-gray-50 text-gray-900">
        <Sidebar />
        <div className="flex-1 p-8 text-red-600">Error: {error || "Practicante no encontrado."}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 text-gray-900">
      <Sidebar />

      {/* Contenido principal de la página de detalle */}
      <div className="flex-1 flex flex-col overflow-auto p-8 bg-gray-50">
        
        {/* Header superior: Volver y Acciones */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/dashboard/practicantes" className="flex items-center text-gray-600 hover:text-blue-600 transition">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Volver
          </Link>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-1 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition">
              <Edit className="w-4 h-4" />
              <span>Editar</span>
            </button>
            <button className="flex items-center space-x-1 border border-red-500 text-red-600 font-medium py-2 px-4 rounded-lg hover:bg-red-50 transition">
              <Trash2 className="w-4 h-4" />
              <span>Eliminar</span>
            </button>
          </div>
        </div>

        {/* Contenedor principal de la información del practicante */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            {/* Sección de Perfil Principal (Foto, Nombre, Contacto, Descripción) */}
            <div className="flex space-x-8 mb-8 items-start">
            
            {/* Foto de Perfil */}
            <div className="w-36 h-36 rounded-full overflow-hidden flex-shrink-0 border-4 border-gray-100 shadow-md">
                <Image 
                    src={practicante.foto_url} 
                    alt={practicante.nombre} 
                    width={144} 
                    height={144} 
                    className="object-cover w-full h-full"
                    unoptimized={true} 
                />
            </div>

            {/* Información Básica */}
            <div className="flex-1">
                <h1 className="text-3xl font-bold mb-1">{practicante.nombre}</h1>
                <div className="flex items-center space-x-3 mb-2">
                    <span className="text-gray-700 font-semibold">{practicante.area}</span>
                    <EstadoBadge estado={practicante.estado} />
                </div>
                <p className="text-gray-600 mb-4 text-sm">{practicante.descripcion}</p>

                {/* Datos de Contacto */}
                <div className="text-gray-500 text-sm flex flex-wrap gap-x-6 gap-y-2">
                    <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{practicante.email}</span>
                    </div>
                    {practicante.telefono && (
                        <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{practicante.telefono}</span>
                        </div>
                    )}
                    {practicante.portafolio_url && practicante.portafolio_url !== '#' && (
                        <a href={practicante.portafolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-blue-600 hover:underline">
                            <span>Ver portafolio</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>
            </div>

            {/* Secciones de Detalles (Académica, Tecnologías, Soft Skills, Proyectos) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            
            {/* Información Académica */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Información Académica</h2>
                <p className="text-gray-500 text-sm mb-1">Carrera</p>
                <p className="text-gray-700 font-medium">{practicante.carrera}</p>
            </div>

            {/* Tecnologías */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Tecnologías</h2>
                <div className="flex flex-wrap gap-2">
                    {practicante.tecnologias.map((tech, index) => (
                        <span key={index} className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-700 font-medium">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            {/* Soft Skills */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Soft Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {practicante.soft_skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 font-medium">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Proyectos */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Proyectos</h2>
                <div className="space-y-3">
                    {practicante.proyectos.map((project, index) => (
                        <div key={index} className="flex items-center text-gray-700 font-medium">
                            <span className="mr-3 text-blue-600">📁</span>
                            <span>{project}</span>
                        </div>
                    ))}
                </div>
            </div>
            
        </div> 
        </div> 
      </div> 
    </div>
  );
}