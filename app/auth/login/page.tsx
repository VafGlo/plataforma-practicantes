// app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../providers/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();

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
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setError(error.message ?? "Error en autenticación");
      return;
    }

    // Login ok -> redirigir dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#F1F5F9]">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-[360px]">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white text-3xl">
            👤
          </div>
          <h2 className="mt-4 text-xl font-semibold">Bienvenido</h2>
          <p className="text-gray-500 text-sm -mt-1">Ingresa a tu cuenta</p>
        </div>

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
            {loading ? "Iniciando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="text-center mt-6">
          <a href="/auth/signup" className="text-indigo-600 text-sm hover:underline">
            ¿No tienes cuenta? Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}
