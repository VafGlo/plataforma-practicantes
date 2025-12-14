"use client";

import React from "react";
import { cn } from "@/lib/utils";

// -----------------------------------------------------
// INPUT
// -----------------------------------------------------
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900",
        "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

// -----------------------------------------------------
// LABEL
// -----------------------------------------------------
export const Label = ({
  children,
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label
      className={cn("block text-sm font-medium text-gray-700 mb-1", className)}
      {...props}
    >
      {children}
    </label>
  );
};

// -----------------------------------------------------
// BUTTON
// -----------------------------------------------------
export const Button = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "w-full rounded-md bg-blue-600 text-white py-2 text-sm font-medium",
        "hover:bg-blue-700 transition-colors disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// -----------------------------------------------------
// FORM MESSAGE
// -----------------------------------------------------
export const FormMessage = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  if (!children) return null;

  return (
    <p className={cn("text-sm text-red-600 mt-1", className)}>{children}</p>
  );
};

// -----------------------------------------------------
// SIDEBAR
// -----------------------------------------------------
import { LayoutDashboard, Users2, Briefcase, GitBranch } from "lucide-react";

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col justify-between">
      {/* Logo + Título */}
      <div>
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-2xl">
              👥
            </div>
            <div>
              <h1 className="text-lg font-bold">PracticeHub</h1>
              <p className="text-sm text-gray-500 -mt-1">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Menú */}
        <nav className="px-4 space-y-1 mt-4">
          <a
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <LayoutDashboard className="w-5" />
            Dashboard
          </a>

          <a
            href="/practicantes"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <Users2 className="w-5" />
            Practicantes
          </a>

          <a
            href="/proyectos"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <Briefcase className="w-5" />
            Proyectos
          </a>

          <a
            href="/asignaciones"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <GitBranch className="w-5" />
            Asignaciones
          </a>
        </nav>
      </div>

      {/* Usuario inferior */}
      <div className="p-6 border-t flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-500 text-white font-bold rounded-full flex items-center justify-center">
          AD
        </div>
        <div>
          <p className="font-medium text-sm">Admin User</p>
          <p className="text-xs text-gray-500">admin@empresa.com</p>
        </div>
      </div>
    </aside>
  );
};

// -----------------------------------------------------
// TOP CARDS (resumen)
// -----------------------------------------------------
export const TopCards = ({
  total,
  disponibles,
  asignados,
}: {
  total: number;
  disponibles: number;
  asignados: number;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow border">
        <p className="text-sm text-gray-500">Total Practicantes</p>
        <p className="text-3xl font-bold">{total}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border">
        <p className="text-sm text-gray-500">Disponibles</p>
        <p className="text-3xl font-bold text-green-600">{disponibles}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border">
        <p className="text-sm text-gray-500">Asignados</p>
        <p className="text-3xl font-bold text-purple-600">{asignados}</p>
      </div>
    </div>
  );
};

// -----------------------------------------------------
// AREAS CHART (barras horizontales)
// -----------------------------------------------------
export const AreasChart = ({
  data,
}: {
  data: { area: string; count: number }[];
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <h3 className="font-bold mb-4">Practicantes por Área</h3>

      <ul className="space-y-4">
        {data.map((item) => (
          <li key={item.area}>
            <p className="text-sm font-medium text-blank-600">{item.area}</p>
            <div className="w-full bg-blank-200 rounded-full h-3 mt-1">
              <div
                className="h-3 bg-blue-600 rounded-full"
                style={{ width: `${item.count * 20}%` }}
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// -----------------------------------------------------
// DISPONIBILIDAD CHART (pastel simple)
// -----------------------------------------------------
export const DisponibilidadChart = ({
  disponibles,
  asignados,
}: {
  disponibles: number;
  asignados: number;
}) => {
  const total = disponibles + asignados;
  const porcentaje = total === 0 ? 0 : Math.round((disponibles / total) * 100);

  return (
    <div className="bg-white p-6 rounded-xl shadow border flex flex-col items-center">
      <h3 className="font-semibold mb-4">Disponibilidad</h3>

      <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center relative">
        <div
          className="absolute w-full h-full rounded-full border-8 border-green-500 border-t-gray-200"
          style={{
            transform: `rotate(${(porcentaje / 100) * 360}deg)`,
          }}
        ></div>

        <p className="absolute text-xl font-bold">{porcentaje}%</p>
      </div>

      <div className="flex justify-between w-full mt-6 text-sm">
        <p className="text-green-600 font-medium">Disponibles: {disponibles}</p>
        <p className="text-purple-600 font-medium">Asignados: {asignados}</p>
      </div>
    </div>
  );
};

// -----------------------------------------------------
// QUICK ACCESS
// -----------------------------------------------------
export const QuickAccess = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <div className="bg-white shadow border rounded-xl p-6 hover:bg-gray-50 transition cursor-pointer">
        <p className="font-semibold">Ver Practicantes</p>
        <p className="text-sm text-gray-500">Gestiona el listado completo</p>
      </div>

      <div className="bg-white shadow border rounded-xl p-6 hover:bg-gray-50 transition cursor-pointer">
        <p className="font-semibold">Ver Proyectos</p>
        <p className="text-sm text-gray-500">
          Administra proyectos activos
        </p>
      </div>

      <div className="bg-white shadow border rounded-xl p-6 hover:bg-gray-50 transition cursor-pointer">
        <p className="font-semibold">Asignar Practicantes</p>
        <p className="text-sm text-gray-500">
          Distribuye recursos a proyectos
        </p>
      </div>
    </div>
  );
};


