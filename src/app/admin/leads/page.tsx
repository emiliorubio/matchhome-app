"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { AdminGuard } from "@/src/components/AdminGuard";
import { getLeads, updateLeadStatus } from "@/src/services/leads";
import { Lead } from "@/src/types/lead";

const leadStatuses = [
  "Nuevo",
  "Contactado",
  "Aprobado",
  "Rechazado",
];

const statusFilters = [
  "Todos",
  "Nuevo",
  "Contactado",
  "Aprobado",
  "Rechazado",
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [propertyFilter, setPropertyFilter] = useState("Todas");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadLeads() {
      const data = await getLeads();
      setLeads(data);
      setLoading(false);
    }

    loadLeads();
  }, []);

  const propertyOptions = useMemo(() => {
    const uniqueProperties = Array.from(
      new Set(leads.map((lead) => lead.property_title).filter(Boolean))
    );

    return ["Todas", ...uniqueProperties];
  }, [leads]);

  const leadsByProperty = useMemo(() => {
    return Array.from(
      leads.reduce((map, lead) => {
        const title = lead.property_title || "Sin propiedad";
        map.set(title, (map.get(title) || 0) + 1);
        return map;
      }, new Map<string, number>())
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 9);
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus =
        statusFilter === "Todos" ||
        (lead.status || "Nuevo") === statusFilter;

      const matchesProperty =
        propertyFilter === "Todas" ||
        lead.property_title === propertyFilter;

      const cleanSearch = search.toLowerCase().trim();

      const matchesSearch =
        !cleanSearch ||
        lead.name.toLowerCase().includes(cleanSearch) ||
        lead.phone.toLowerCase().includes(cleanSearch) ||
        lead.property_title.toLowerCase().includes(cleanSearch) ||
        (lead.income || "").toLowerCase().includes(cleanSearch);

      return matchesStatus && matchesProperty && matchesSearch;
    });
  }, [leads, statusFilter, propertyFilter, search]);

  async function handleStatusChange(id: number, status: string) {
    setUpdatingId(id);

    const updatedLead = await updateLeadStatus(id, status);

    if (updatedLead) {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === id ? updatedLead : lead
        )
      );
    } else {
      alert("No se pudo actualizar el estado.");
    }

    setUpdatingId(null);
  }

  function getWhatsappUrl(phone: string) {
    const cleanPhone = phone.replace(/\D/g, "").replace(/^56/, "");
    return `https://wa.me/56${cleanPhone}`;
  }

  function clearFilters() {
    setStatusFilter("Todos");
    setPropertyFilter("Todas");
    setSearch("");
  }

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
                Gestiona postulantes, campañas, estados y contacto por WhatsApp.
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

          <section className="mt-10 grid gap-6 md:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Total leads</p>
              <p className="mt-3 text-4xl font-black">
                {leads.length}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Nuevos</p>
              <p className="mt-3 text-4xl font-black">
                {
                  leads.filter(
                    (lead) => (lead.status || "Nuevo") === "Nuevo"
                  ).length
                }
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Contactados</p>
              <p className="mt-3 text-4xl font-black">
                {
                  leads.filter((lead) => lead.status === "Contactado")
                    .length
                }
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Aprobados</p>
              <p className="mt-3 text-4xl font-black">
                {
                  leads.filter((lead) => lead.status === "Aprobado")
                    .length
                }
              </p>
            </div>
          </section>

          <section className="mt-10 rounded-[32px] border border-cyan-500/20 bg-white/5 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Leads por propiedad
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Ideal para medir qué campañas o departamentos generan más consultas.
                </p>
              </div>

              {(propertyFilter !== "Todas" || statusFilter !== "Todos" || search) && (
                <button
                  onClick={clearFilters}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
                >
                  Limpiar filtros
                </button>
              )}
            </div>

            {leadsByProperty.length === 0 ? (
              <div className="mt-6 rounded-3xl bg-black/40 p-8 text-center text-zinc-400">
                Todavía no hay leads para analizar.
              </div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {leadsByProperty.map(([property, total]) => (
                  <button
                    key={property}
                    onClick={() => {
                      setPropertyFilter(property);
                      setStatusFilter("Todos");
                      setSearch("");
                    }}
                    className={`rounded-3xl border p-5 text-left transition ${
                      propertyFilter === property
                        ? "border-cyan-400 bg-cyan-500/10"
                        : "border-white/10 bg-black/40 hover:border-cyan-400/40 hover:bg-cyan-500/10"
                    }`}
                  >
                    <p className="text-sm text-zinc-400">
                      Propiedad
                    </p>

                    <h3 className="mt-2 line-clamp-2 font-bold">
                      {property}
                    </h3>

                    <p className="mt-4 text-3xl font-black text-cyan-300">
                      {total}
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      leads recibidos
                    </p>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="mt-10 rounded-[32px] border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Solicitudes
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Mostrando {filteredLeads.length} de {leads.length} leads.
                </p>

                {propertyFilter !== "Todas" && (
                  <p className="mt-2 text-sm text-cyan-400">
                    Campaña / propiedad filtrada: {propertyFilter}
                  </p>
                )}
              </div>

              <div className="flex w-full flex-col gap-3 md:w-auto md:items-end">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar nombre, teléfono o propiedad..."
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm text-white outline-none transition focus:border-cyan-400 md:w-[380px]"
                />

                <select
                  value={propertyFilter}
                  onChange={(event) => setPropertyFilter(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm text-white outline-none transition focus:border-cyan-400 md:w-[380px]"
                >
                  {propertyOptions.map((property) => (
                    <option key={property} value={property}>
                      {property}
                    </option>
                  ))}
                </select>

                <div className="flex flex-wrap gap-2">
                  {statusFilters.map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                        statusFilter === status
                          ? "bg-white text-black"
                          : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-zinc-400">
                Cargando leads...
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="py-16 text-center text-zinc-400">
                No hay leads para estos filtros.
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[1300px] border-separate border-spacing-y-3 text-left">
                  <thead>
                    <tr className="text-sm text-zinc-500">
                      <th className="px-4 py-2">Fecha</th>
                      <th className="px-4 py-2">Estado</th>
                      <th className="px-4 py-2">Nombre</th>
                      <th className="px-4 py-2">WhatsApp</th>
                      <th className="px-4 py-2">Renta</th>
                      <th className="px-4 py-2">Propiedad</th>
                      <th className="px-4 py-2">Precio</th>
                      <th className="px-4 py-2">Mensaje</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="rounded-2xl bg-black/40 text-sm"
                      >
                        <td className="rounded-l-2xl px-4 py-4 text-zinc-300">
                          {new Date(lead.created_at).toLocaleString("es-CL")}
                        </td>

                        <td className="px-4 py-4">
                          <select
                            value={lead.status || "Nuevo"}
                            disabled={updatingId === lead.id}
                            onChange={(event) =>
                              handleStatusChange(
                                lead.id,
                                event.target.value
                              )
                            }
                            className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none"
                          >
                            {leadStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-4 py-4 font-semibold">
                          {lead.name}
                        </td>

                        <td className="px-4 py-4">
                          <a
                            href={getWhatsappUrl(lead.phone)}
                            target="_blank"
                            className="rounded-xl bg-green-500/10 px-4 py-2 text-green-400 transition hover:bg-green-500/20"
                          >
                            WhatsApp
                          </a>
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