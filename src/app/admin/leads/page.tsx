"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { AdminGuard } from "@/src/components/AdminGuard";
import { getLeads } from "@/src/services/leads";
import { Lead } from "@/src/types/lead";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeads() {
      const data = await getLeads();

      setLeads(data);
      setLoading(false);
    }

    loadLeads();
  }, []);

  return (
    <AdminGuard>
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                MatchHome Admin
              </p>

              <h1 className="mt-3 text-4xl font-black">
                Leads recibidos
              </h1>

              <p className="mt-3 max-w-2xl text-zinc-400">
                Aquí verás las solicitudes de visita enviadas desde las propiedades.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/admin"
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-center font-semibold transition hover:bg-white/10"
              >
                Volver al admin
              </Link>

              <Link
                href="/"
                className="rounded-2xl bg-white px-6 py-3 text-center font-semibold text-black transition hover:scale-105"
              >
                Ver sitio
              </Link>
            </div>
          </div>

          <section className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Total leads</p>
              <p className="mt-3 text-4xl font-black">
                {leads.length}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Con renta informada</p>
              <p className="mt-3 text-4xl font-black">
                {leads.filter((lead) => lead.income).length}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Último lead</p>
              <p className="mt-3 text-lg font-bold">
                {leads[0]
                  ? new Date(leads[0].created_at).toLocaleDateString("es-CL")
                  : "-"}
              </p>
            </div>
          </section>

          <section className="mt-10 rounded-[32px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">
              Solicitudes
            </h2>

            {loading ? (
              <div className="py-16 text-center text-zinc-400">
                Cargando leads...
              </div>
            ) : leads.length === 0 ? (
              <div className="py-16 text-center text-zinc-400">
                Todavía no hay leads registrados.
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[1100px] border-separate border-spacing-y-3 text-left">
                  <thead>
                    <tr className="text-sm text-zinc-500">
                      <th className="px-4 py-2">Fecha</th>
                      <th className="px-4 py-2">Nombre</th>
                      <th className="px-4 py-2">Teléfono</th>
                      <th className="px-4 py-2">Renta</th>
                      <th className="px-4 py-2">Propiedad</th>
                      <th className="px-4 py-2">Precio</th>
                      <th className="px-4 py-2">Mensaje</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="rounded-2xl bg-black/40 text-sm"
                      >
                        <td className="rounded-l-2xl px-4 py-4 text-zinc-300">
                          {new Date(lead.created_at).toLocaleString("es-CL")}
                        </td>

                        <td className="px-4 py-4 font-semibold">
                          {lead.name}
                        </td>

                        <td className="px-4 py-4 text-cyan-300">
                          {lead.phone}
                        </td>

                        <td className="px-4 py-4 text-zinc-300">
                          {lead.income || "-"}
                        </td>

                        <td className="px-4 py-4 text-zinc-300">
                          {lead.property_title}
                        </td>

                        <td className="px-4 py-4 text-zinc-300">
                          {lead.property_price || "-"}
                        </td>

                        <td className="rounded-r-2xl px-4 py-4 text-zinc-300">
                          {lead.message || "-"}
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
    </AdminGuard>
  );
}