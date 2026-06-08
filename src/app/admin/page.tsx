"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getProperties } from "@/src/services/properties";
import { Property } from "@/src/types/property";

export default function AdminPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      const data = await getProperties();

      setProperties(data);
      setLoading(false);
    }

    loadProperties();
  }, []);

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              MatchHome Admin
            </p>

            <h1 className="mt-3 text-4xl font-black">
              Panel de propiedades
            </h1>

            <p className="mt-3 max-w-2xl text-zinc-400">
              Aquí podrás administrar las propiedades disponibles en la plataforma.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-center font-semibold transition hover:bg-white/10"
          >
            Volver al sitio
          </Link>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-zinc-400">Propiedades</p>
            <p className="mt-3 text-4xl font-black">
              {properties.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-zinc-400">Con estacionamiento</p>
            <p className="mt-3 text-4xl font-black">
              {properties.filter((property) => property.parking).length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-zinc-400">Aceptan mascotas</p>
            <p className="mt-3 text-4xl font-black">
              {properties.filter((property) => property.pets).length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-zinc-400">Precio promedio</p>
            <p className="mt-3 text-3xl font-black">
              {properties.length > 0
                ? `$${Math.round(
                    properties.reduce(
                      (total, property) => total + property.price,
                      0
                    ) / properties.length
                  ).toLocaleString("es-CL")}`
                : "$0"}
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Listado de propiedades
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Datos cargados desde Supabase.
              </p>
            </div>

            <button className="rounded-2xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105">
              Agregar propiedad
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-zinc-400">
              Cargando propiedades...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-sm text-zinc-500">
                    <th className="px-4 py-2">Propiedad</th>
                    <th className="px-4 py-2">Comuna</th>
                    <th className="px-4 py-2">Precio</th>
                    <th className="px-4 py-2">Presupuesto</th>
                    <th className="px-4 py-2">Match</th>
                    <th className="px-4 py-2">Parking</th>
                    <th className="px-4 py-2">Mascotas</th>
                  </tr>
                </thead>

                <tbody>
                  {properties.map((property) => (
                    <tr
                      key={property.id}
                      className="rounded-2xl bg-black/40 text-sm"
                    >
                      <td className="rounded-l-2xl px-4 py-4 font-semibold">
                        {property.title}
                      </td>

                      <td className="px-4 py-4 text-zinc-300">
                        {property.location}
                      </td>

                      <td className="px-4 py-4 text-zinc-300">
                        ${property.price.toLocaleString("es-CL")}
                      </td>

                      <td className="px-4 py-4 text-zinc-300">
                        {property.budget}
                      </td>

                      <td className="px-4 py-4 text-green-400">
                        {property.match}%
                      </td>

                      <td className="px-4 py-4">
                        {property.parking ? "Sí" : "No"}
                      </td>

                      <td className="rounded-r-2xl px-4 py-4">
                        {property.pets ? "Sí" : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}