"use client";

import { useEffect, useState } from "react";

type AdminGuardProps = {
  children: React.ReactNode;
};

export function AdminGuard({ children }: AdminGuardProps) {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedAccess = localStorage.getItem("matchhome-admin-access");

    if (storedAccess === "true") {
      setIsUnlocked(true);
    }
  }, []);

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (password === adminPassword) {
      localStorage.setItem("matchhome-admin-access", "true");
      setIsUnlocked(true);
      setError("");
      return;
    }

    setError("Clave incorrecta.");
  }

  function handleLogout() {
    localStorage.removeItem("matchhome-admin-access");
    setIsUnlocked(false);
    setPassword("");
  }

  if (isUnlocked) {
    return (
      <>
        <div className="fixed bottom-6 right-6 z-[200]">
          <button
            onClick={handleLogout}
            className="rounded-2xl border border-white/10 bg-black/80 px-5 py-3 text-sm font-semibold text-white shadow-2xl backdrop-blur-xl transition hover:bg-white/10"
          >
            Salir admin
          </button>
        </div>

        {children}
      </>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
          MatchHome Admin
        </p>

        <h1 className="mt-4 text-4xl font-black">
          Acceso privado
        </h1>

        <p className="mt-4 text-zinc-400">
          Ingresa la clave para administrar propiedades.
        </p>

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Clave admin"
          className="mt-8 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-center outline-none transition focus:border-fuchsia-500"
        />

        {error && (
          <p className="mt-4 text-sm text-red-400">
            {error}
          </p>
        )}

        <button className="mt-6 w-full rounded-2xl bg-white px-6 py-4 font-bold text-black transition hover:scale-105">
          Entrar
        </button>
      </form>
    </main>
  );
}