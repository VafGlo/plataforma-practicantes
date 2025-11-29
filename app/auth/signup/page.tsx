// app/auth/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../providers/AuthProvider";

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailRegex.test(email)) {
      setError("Por favor ingresa un correo válido.");
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      setError(error.message ?? "Error en el registro");
      return;
    }

    // En supabase, por defecto puede pedir confirmación por correo.
    // Redirigimos a login con mensaje (o podrías mostrar confirmación).
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#F1F5F9]">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-[360px]">
        <h2 className="text-xl font-semibold mb-4 text-center">Crear cuenta</h2>

        <form onSubmit={handleSubmit}>
          <label className="text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            type="email"
            placeholder="tu@empresa.com"
            className="w-full p-3 mt-1 mb-4 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            placeholder="********"
            className="w-full p-3 mt-1 mb-2 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center mt-6">
          <a href="/auth/login" className="text-indigo-600 text-sm hover:underline">
            ¿Ya tienes cuenta? Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
