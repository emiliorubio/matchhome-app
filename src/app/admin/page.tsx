"use client";

import { AdminGuard } from "@/src/components/AdminGuard";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";

import {
  createPropertiesBulk,
  createProperty,
  deleteProperty,
  getProperties,
  NewProperty,
  updateProperty,
  uploadPropertyPhotos,
} from "@/src/services/properties";
import { Property } from "@/src/types/property";

const gradients = [
  "from-fuchsia-500 to-cyan-500",
  "from-cyan-500 to-blue-500",
  "from-orange-500 to-pink-500",
  "from-green-500 to-emerald-500",
];

const initialForm: NewProperty = {
  title: "",
  location: "",
  price: 0,
  match: 90,
  gradient: "from-fuchsia-500 to-cyan-500",
  budget: "Hasta $300.000",

  pets: true,
  parking: false,

  typology: "",
  metro: "",
  address: "",
  project: "",

  unit_number: "",

  featured: false,

  promotion: "",
  guarantee_installments: true,
  internal_notes: "",

  description: "",

  cover_photo: "",
  photos: "",

  status: "Disponible",
};

function getBudgetFromPrice(price: number) {
  if (price <= 300000) return "Hasta $300.000";
  if (price <= 500000) return "$300.000 - $500.000";
  if (price <= 800000) return "$500.000 - $800.000";
  return "$800.000+";
}

function parsePrice(value: unknown) {
  if (typeof value === "number") return value;
  if (!value) return 0;

  const cleanValue = String(value)
    .replaceAll("$", "")
    .replaceAll(".", "")
    .replaceAll(",", "")
    .trim();

  const price = Number(cleanValue);
  return Number.isNaN(price) ? 0 : price;
}

function hasValue(value: unknown) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function normalizeExcelRow(row: Record<string, unknown>, index: number) {
  const tenant = row["Arrendatario"];
  if (hasValue(tenant)) return null;

  const project = String(row["Proyecto"] ?? "").trim();
  const address = String(row["Dirección"] ?? "").trim();
  const typology = String(row["Tipología"] ?? "").trim();
  const location = String(row["Comuna"] ?? "").trim();
  const metro = String(row["Metro"] ?? "").trim();
  const price = parsePrice(row["Arriendo"]);
  const parkingValue = row["Estac."];

  if (!address || !location || price <= 1000) return null;

  const property: NewProperty = {
    title: address,
    project,
    unit_number: "",
    address,
    typology,
    metro,
    location,
    price,
    match: 90,
    gradient: gradients[index % gradients.length],
    budget: getBudgetFromPrice(price),
    parking: hasValue(parkingValue),
    pets: true,
    featured: false,
    promotion: "",
    guarantee_installments: true,
    internal_notes: "",
    description: "",
    photos: "",
    cover_photo: "",
    status: "Disponible",
  };

  return property;
}

export default function AdminPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<NewProperty>(initialForm);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [excelPreview, setExcelPreview] = useState<NewProperty[]>([]);
  const [excelFileName, setExcelFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [skippedRows, setSkippedRows] = useState(0);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  const averagePrice = useMemo(() => {
    if (properties.length === 0) return 0;

    return Math.round(
      properties.reduce((total, property) => total + property.price, 0) /
      properties.length
    );
  }, [properties]);

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

    if (editingId) {
      const updatedProperty = await updateProperty(editingId, form);

      if (updatedProperty) {
        setProperties((prev) =>
          prev.map((property) =>
            property.id === editingId ? updatedProperty : property
          )
        );

        setEditingId(null);
        setForm(initialForm);
      } else {
        alert("No se pudo actualizar la propiedad.");
      }
    } else {
      const createdProperty = await createProperty(form);

      if (createdProperty) {
        setProperties((prev) => [createdProperty, ...prev]);
        setForm(initialForm);
      } else {
        alert("No se pudo crear la propiedad.");
      }
    }

    setSaving(false);
  }

  function handleEditProperty(property: Property) {
    setEditingId(property.id);

    setForm({
      title: property.title,
      location: property.location,
      price: property.price,
      match: property.match,
      gradient: property.gradient,
      budget: property.budget,
      pets: property.pets,
      parking: property.parking,
      typology: property.typology ?? "",
      metro: property.metro ?? "",
      address: property.address ?? "",
      project: property.project ?? "",
      unit_number: property.unit_number ?? "",
      featured: property.featured ?? false,
      promotion: property.promotion ?? "",
      guarantee_installments: property.guarantee_installments ?? true,
      internal_notes: property.internal_notes ?? "",
      description: property.description ?? "",
      photos: property.photos ?? "",
      cover_photo: property.cover_photo ?? "",
      status: property.status ?? "Disponible",
    });

    window.scrollTo({
      top: 420,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(initialForm);
  }

  async function handleDeleteProperty(id: number) {
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar esta propiedad?"
    );

    if (!confirmed) return;

    setDeletingId(id);

    const deleted = await deleteProperty(id);

    if (deleted) {
      setProperties((prev) => prev.filter((property) => property.id !== id));

      if (editingId === id) {
        cancelEdit();
      }
    } else {
      alert("No se pudo eliminar la propiedad.");
    }

    setDeletingId(null);
  }

  async function handleExcelUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setExcelFileName(file.name);

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
      defval: "",
      range: 1,
    });

    const normalizedProperties: NewProperty[] = [];

    rows.forEach((row, index) => {
      const property = normalizeExcelRow(row, index);

      if (property) {
        normalizedProperties.push(property);
      }
    });

    setExcelPreview(normalizedProperties);
    setSkippedRows(rows.length - normalizedProperties.length);
  }

  async function handleImportExcel() {
    if (excelPreview.length === 0) {
      alert("No hay propiedades válidas para importar.");
      return;
    }

    setImporting(true);

    const importedProperties = await createPropertiesBulk(excelPreview);

    if (importedProperties) {
      setProperties((prev) => [...importedProperties, ...prev]);
      setExcelPreview([]);
      setExcelFileName("");
      setSkippedRows(0);
      alert(`Se importaron ${importedProperties.length} propiedades.`);
    } else {
      alert("No se pudo importar el Excel.");
    }

    setImporting(false);
  }

  async function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) return;

    setUploadingPhotos(true);

    const uploadedUrls = await uploadPropertyPhotos(files);

    if (uploadedUrls.length > 0) {
      const currentPhotos = form.photos
        ? form.photos
          .split(",")
          .map((photo) => photo.trim())
          .filter(Boolean)
        : [];

      const nextPhotos = [...currentPhotos, ...uploadedUrls];

      setForm({
        ...form,
        photos: nextPhotos.join(","),
      });
    } else {
      alert("No se pudo subir ninguna foto.");
    }

    setUploadingPhotos(false);
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
                Panel de propiedades
              </h1>

              <p className="mt-3 max-w-2xl text-zinc-400">
                Administra propiedades, carga datos manualmente o importa desde
                Excel.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/admin/leads"
                className="rounded-2xl bg-white px-6 py-3 text-center font-semibold text-black transition hover:scale-105"
              >
                Ver leads
              </Link>

              <Link
                href="/"
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-center font-semibold transition hover:bg-white/10"
              >
                Volver al sitio
              </Link>
            </div>
          </div>

          <section className="mt-10 grid gap-6 md:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Propiedades</p>
              <p className="mt-3 text-4xl font-black">{properties.length}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Destacadas</p>
              <p className="mt-3 text-4xl font-black">
                {properties.filter((property) => property.featured).length}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Con estacionamiento</p>
              <p className="mt-3 text-4xl font-black">
                {properties.filter((property) => property.parking).length}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Precio promedio</p>
              <p className="mt-3 text-3xl font-black">
                ${averagePrice.toLocaleString("es-CL")}
              </p>
            </div>
          </section>

          <section className="mt-10 rounded-[32px] border border-cyan-500/20 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">Importar desde Excel</h2>

            <p className="mt-1 text-sm text-zinc-400">
              Se importarán solo propiedades sin arrendatario y con arriendo
              válido.
            </p>

            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelUpload}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-sm text-zinc-300 md:max-w-md"
              />

              <button
                onClick={handleImportExcel}
                disabled={importing || excelPreview.length === 0}
                className="rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:scale-105 disabled:opacity-50"
              >
                {importing ? "Importando..." : "Importar propiedades"}
              </button>
            </div>

            {excelFileName && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-5">
                <p className="font-semibold">Archivo: {excelFileName}</p>

                <p className="mt-2 text-sm text-zinc-400">
                  Propiedades listas para importar: {excelPreview.length}
                </p>

                <p className="mt-1 text-sm text-zinc-400">
                  Filas omitidas: {skippedRows}
                </p>
              </div>
            )}
          </section>

          <section className="mt-10 rounded-[32px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">
              {editingId ? "Editar propiedad" : "Agregar propiedad manual"}
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              {editingId
                ? "Estás editando una propiedad existente."
                : "Esta propiedad se guardará directamente en Supabase."}
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
                value={form.unit_number}
                onChange={(event) =>
                  setForm({
                    ...form,
                    unit_number: event.target.value,
                  })
                }
                placeholder="Número de departamento (interno)"
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
                value={form.promotion}
                onChange={(event) =>
                  setForm({
                    ...form,
                    promotion: event.target.value,
                  })
                }
                placeholder="Promoción (ej: 50% primer mes)"
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-fuchsia-500"
              />

              <input
                value={form.price || ""}
                onChange={(event) =>
                  setForm({ ...form, price: Number(event.target.value) })
                }
                type="number"
                placeholder="Precio arriendo"
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-fuchsia-500"
              />

              <input
                value={form.match}
                onChange={(event) =>
                  setForm({ ...form, match: Number(event.target.value) })
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
                <option value="from-cyan-500 to-blue-500">Cyan / Azul</option>
                <option value="from-orange-500 to-pink-500">
                  Naranjo / Rosado
                </option>
                <option value="from-green-500 to-emerald-500">Verde</option>
              </select>

              <select
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value })
                }
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-fuchsia-500"
              >
                <option value="Disponible">Disponible</option>
                <option value="Reservado">Reservado</option>
                <option value="Arrendado">Arrendado</option>
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

              <label className="flex items-center gap-3 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-5 py-4">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) =>
                    setForm({ ...form, featured: event.target.checked })
                  }
                />
                Propiedad destacada
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-4">
                <input
                  type="checkbox"
                  checked={form.guarantee_installments}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      guarantee_installments:
                        event.target.checked,
                    })
                  }
                />
                Garantía hasta en 6 cuotas
              </label>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Descripción completa de la propiedad"
                rows={4}
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-fuchsia-500 md:col-span-2"
              />
              <textarea
                value={form.internal_notes}
                onChange={(event) =>
                  setForm({
                    ...form,
                    internal_notes: event.target.value,
                  })
                }
                placeholder="Notas internas (solo admin)"
                rows={3}
                className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 outline-none md:col-span-2"
              />
              <textarea
                value={form.photos}
                onChange={(event) =>
                  setForm({ ...form, photos: event.target.value })
                }
                placeholder="URLs de fotos separadas por coma"
                rows={3}
                className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-fuchsia-500 md:col-span-2"
              />

              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5 md:col-span-2">
                <p className="font-semibold text-cyan-300">
                  Subir fotos a Supabase
                </p>

                <p className="mt-1 text-sm text-zinc-400">
                  Puedes seleccionar varias imágenes. Se agregarán
                  automáticamente al campo de fotos.
                </p>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-sm text-zinc-300"
                />

                {uploadingPhotos && (
                  <p className="mt-3 text-sm text-cyan-300">
                    Subiendo fotos...
                  </p>
                )}

                {form.photos && (
                  <div className="mt-5 grid gap-3 md:grid-cols-4">
                    {form.photos
                      .split(",")
                      .map((photo) => photo.trim())
                      .filter(Boolean)
                      .slice(0, 8)
                      .map((photo) => (
                        <div key={photo} className="relative">
                          <img
                            src={photo}
                            alt="Foto propiedad"
                            className={`h-24 w-full rounded-xl object-cover ${form.cover_photo === photo
                              ? "ring-4 ring-cyan-400"
                              : ""
                              }`}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setForm({
                                ...form,
                                cover_photo: photo,
                              })
                            }
                            className="absolute bottom-2 left-2 rounded-full bg-black/70 px-3 py-1 text-xs text-white backdrop-blur-xl"
                          >
                            {form.cover_photo === photo ? "Portada" : "Usar portada"}
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 md:col-span-2 md:flex-row">
                <button
                  disabled={saving || uploadingPhotos}
                  className="rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:scale-105 disabled:opacity-50"
                >
                  {saving
                    ? "Guardando..."
                    : editingId
                      ? "Guardar cambios"
                      : "Guardar propiedad"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-semibold transition hover:bg-white/10"
                  >
                    Cancelar edición
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="mt-10 rounded-[32px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">Listado de propiedades</h2>

            <p className="mt-1 text-sm text-zinc-400">
              Datos cargados desde Supabase.
            </p>

            {loading ? (
              <div className="py-16 text-center text-zinc-400">
                Cargando propiedades...
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[1500px] border-separate border-spacing-y-3 text-left">
                  <thead>
                    <tr className="text-sm text-zinc-500">
                      <th className="px-4 py-2">Propiedad</th>
                      <th className="px-4 py-2">Destacada</th>
                      <th className="px-4 py-2">Estado</th>
                      <th className="px-4 py-2">Proyecto</th>
                      <th className="px-4 py-2">Comuna</th>
                      <th className="px-4 py-2">Tipo</th>
                      <th className="px-4 py-2">Metro</th>
                      <th className="px-4 py-2">Precio</th>
                      <th className="px-4 py-2">Parking</th>
                      <th className="px-4 py-2">Mascotas</th>
                      <th className="px-4 py-2">Fotos</th>
                      <th className="px-4 py-2">Acciones</th>
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

                        <td className="px-4 py-4">
                          {property.featured ? "Sí" : "No"}
                        </td>

                        <td className="px-4 py-4 text-zinc-300">
                          {property.status || "Disponible"}
                        </td>

                        <td className="px-4 py-4 text-zinc-300">
                          {property.project || "-"}
                        </td>

                        <td className="px-4 py-4 text-zinc-300">
                          {property.location}
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

                        <td className="px-4 py-4">
                          {property.pets ? "Sí" : "No"}
                        </td>

                        <td className="px-4 py-4">
                          {property.photos ? "Sí" : "No"}
                        </td>

                        <td className="rounded-r-2xl px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProperty(property)}
                              className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-500/20"
                            >
                              Editar
                            </button>

                            <button
                              onClick={() => handleDeleteProperty(property.id)}
                              disabled={deletingId === property.id}
                              className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                            >
                              {deletingId === property.id
                                ? "Eliminando..."
                                : "Eliminar"}
                            </button>
                          </div>
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