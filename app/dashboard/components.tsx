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
export const Sidebar = () => {
  <div className="h-screen w-64 bg-white border-r flex flex-col justify-between">
  <div>
    <div className="p-6 text-2xl font-bold text-gray-700 tracking-tight">
      PracticeHub
    </div>

    <nav className="px-4 space-y-1">
      <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition">
        Dashboard
      </a>
      <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition">
        Practicantes
      </a>
      <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition">
        Proyectos
      </a>
      <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition">
        Asignaciones
      </a>
    </nav>
  </div>

  <div className="p-4 border-t">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center font-bold">
        AD
      </div>
      <div className="flex flex-col text-sm">
        <span className="font-medium text-gray-700">Admin User</span>
        <span className="text-gray-500">admin@empresa.com</span>
      </div>
    </div>
  </div>
</div>

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


