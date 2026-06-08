"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

import {
  createProperty,
  getProperties,
  NewProperty,
} from "@/src/services/properties";
import { Property } from "@/src/types/property";

const initialForm: NewProperty = {
  title: "",
  location: "",
  price: 0,
  match: 90,
  gradient: "from-fuchsia-500 to-cyan-500",
  budget: "Hasta $300.000",
  pets: false,
  parking: false,
  typology: "",
  metro: "",
  address: "",
  project: "",
};

export default function AdminPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<NewProperty>(initialForm);

  async function loadProperties() {
    const data = await getProperties();

    setProperties(data);
    setLoading(false);
  }

  useEffect(() => {
    loadProperties();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title || !form.location || !form.price) {
      alert("Completa título, comuna y precio.");
      return;
    }

    setSaving(true);

    const createdProperty = await createProperty(form);

    if (createdProperty) {
      setProperties((prev) => [createdProperty, ...prev]);
      setForm(initialForm);
    } else {
      alert("No se pudo crear la propiedad.");
    }

    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              MatchHome Admin
            </p>

            <h1 className="mt-3 text-4xl font-black">
              Panel de propiedades
            </h1>

            <p className="mt-3 max-w-2xl text-zinc-400">
              Administra propiedades, datos comerciales y atributos que luego usaremos para importar desde Excel.
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
          <h2 className="text-2xl font-bold">
            Agregar propiedad
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Esta propiedad se guardará directamente en Supabase.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-4 md:grid-cols-2"
          >
            <input
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              placeholder="Título comercial"
              className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-fuchsia-500"
            />

            <input
              value={form.project}
              onChange={(event) =>
                setForm({ ...form, project: event.target.value })
              }
              placeholder="Proyecto / Edificio"
              className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-fuchsia-500"
            />

            <input
              value={form.location}
              onChange={(event) =>
                setForm({ ...form, location: event.target.value })
              }
              placeholder="Comuna"
              className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-fuchsia-500"
            />

            <input
              value={form.address}
              onChange={(event) =>
                setForm({ ...form, address: event.target.value })
              }
              placeholder="Dirección"
              className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-fuchsia-500"
            />

            <input
              value={form.typology}
              onChange={(event) =>
                setForm({ ...form, typology: event.target.value })
              }
              placeholder="Tipología, ejemplo: 1D1B"
              className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-fuchsia-500"
            />

            <input
              value={form.metro}
              onChange={(event) =>
                setForm({ ...form, metro: event.target.value })
              }
              placeholder="Metro cercano"
              className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-fuchsia-500"
            />

            <input
              value={form.price || ""}
              onChange={(event) =>
                setForm({
                  ...form,
                  price: Number(event.target.value),
                })
              }
              type="number"
              placeholder="Precio arriendo"
              className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-fuchsia-500"
            />

            <input
              value={form.match}
              onChange={(event) =>
                setForm({
                  ...form,
                  match: Number(event.target.value),
                })
              }
              type="number"
              min={0}
              max={100}
              placeholder="Match"
              className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-fuchsia-500"
            />

            <select
              value={form.budget}
              onChange={(event) =>
                setForm({ ...form, budget: event.target.value })
              }
              className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-fuchsia-500"
            >
              <option>Hasta $300.000</option>
              <option>$300.000 - $500.000</option>
              <option>$500.000 - $800.000</option>
              <option>$800.000+</option>
            </select>

            <select
              value={form.gradient}
              onChange={(event) =>
                setForm({ ...form, gradient: event.target.value })
              }
              className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-fuchsia-500"
            >
              <option value="from-fuchsia-500 to-cyan-500">
                Fucsia / Cyan
              </option>
              <option value="from-cyan-500 to-blue-500">
                Cyan / Azul
              </option>
              <option value="from-orange-500 to-pink-500">
                Naranjo / Rosado
              </option>
              <option value="from-green-500 to-emerald-500">
                Verde
              </option>
            </select>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-5 py-4">
              <input
                type="checkbox"
                checked={form.parking}
                onChange={(event) =>
                  setForm({ ...form, parking: event.target.checked })
                }
              />
              Tiene estacionamiento
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-5 py-4">
              <input
                type="checkbox"
                checked={form.pets}
                onChange={(event) =>
                  setForm({ ...form, pets: event.target.checked })
                }
              />
              Acepta mascotas
            </label>

            <button
              disabled={saving}
              className="rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:scale-105 disabled:opacity-50 md:col-span-2"
            >
              {saving ? "Guardando..." : "Guardar propiedad"}
            </button>
          </form>
        </section>

        <section className="mt-10 rounded-[32px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">
            Listado de propiedades
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Datos cargados desde Supabase.
          </p>

          {loading ? (
            <div className="py-16 text-center text-zinc-400">
              Cargando propiedades...
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[1100px] border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-sm text-zinc-500">
                    <th className="px-4 py-2">Propiedad</th>
                    <th className="px-4 py-2">Proyecto</th>
                    <th className="px-4 py-2">Comuna</th>
                    <th className="px-4 py-2">Dirección</th>
                    <th className="px-4 py-2">Tipo</th>
                    <th className="px-4 py-2">Metro</th>
                    <th className="px-4 py-2">Precio</th>
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
                        {property.project || "-"}
                      </td>

                      <td className="px-4 py-4 text-zinc-300">
                        {property.location}
                      </td>

                      <td className="px-4 py-4 text-zinc-300">
                        {property.address || "-"}
                      </td>

                      <td className="px-4 py-4 text-zinc-300">
                        {property.typology || "-"}
                      </td>

                      <td className="px-4 py-4 text-zinc-300">
                        {property.metro || "-"}
                      </td>

                      <td className="px-4 py-4 text-zinc-300">
                        ${property.price.toLocaleString("es-CL")}
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