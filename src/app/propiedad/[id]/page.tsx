"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Navbar } from "@/src/components/Navbar";
import { getPropertyById } from "@/src/services/properties";
import { Property } from "@/src/types/property";

export default function PropertyDetailPage() {
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  useEffect(() => {
    async function loadProperty() {
      const id = Number(params.id);

      if (!id) {
        setLoading(false);
        return;
      }

      const data = await getPropertyById(id);

      setProperty(data);
      setLoading(false);
    }

    loadProperty();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />

        <div className="flex min-h-screen items-center justify-center">
          <p className="text-zinc-400">Cargando propiedad...</p>
        </div>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />

        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <h1 className="text-4xl font-black">
            Propiedad no encontrada
          </h1>

          <Link
            href="/"
            className="mt-6 rounded-2xl bg-white px-6 py-3 font-bold text-black"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  const photos = property.photos
    ? property.photos
        .split(",")
        .map((photo) => photo.trim())
        .filter(Boolean)
    : [];

  const message = encodeURIComponent(
    `Hola, me interesa esta propiedad:\n\n${property.title}\n${property.typology || ""}\n${property.location}\n$${property.price.toLocaleString("es-CL")}\n\nQuiero iniciar la preevaluación.`
  );

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${message}`
    : "#";

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
          >
            ← Volver a propiedades
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="rounded-[36px] border border-white/10 bg-white/5 p-5">
                {photos.length > 0 ? (
                  <img
                    src={photos[0]}
                    alt={property.title}
                    className="h-[420px] w-full rounded-[28px] object-cover"
                  />
                ) : (
                  <div
                    className={`flex h-[420px] w-full items-center justify-center rounded-[28px] bg-gradient-to-br ${property.gradient}`}
                  >
                    <p className="text-xl font-bold text-white/80">
                      Fotos próximamente
                    </p>
                  </div>
                )}
              </div>

              {photos.length > 1 && (
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {photos.slice(1, 4).map((photo) => (
                    <img
                      key={photo}
                      src={photo}
                      alt={property.title}
                      className="h-32 w-full rounded-2xl object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            <aside className="rounded-[36px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              {property.featured && (
                <div className="mb-5 inline-flex rounded-full bg-yellow-400/20 px-4 py-2 text-sm font-bold text-yellow-300">
                  🔥 Propiedad destacada
                </div>
              )}

              <h1 className="text-4xl font-black leading-tight">
                {property.title}
              </h1>

              <p className="mt-3 text-lg text-zinc-400">
                {property.typology || "Tipología por confirmar"} ·{" "}
                {property.location}
              </p>

              {property.metro && (
                <p className="mt-2 text-zinc-400">
                  🚇 {property.metro}
                </p>
              )}

              <div className="mt-8 rounded-3xl bg-black/40 p-5">
                <p className="text-sm text-zinc-400">Valor arriendo</p>

                <p className="mt-2 text-4xl font-black">
                  ${property.price.toLocaleString("es-CL")}
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-black/40 p-4">
                  <p className="text-sm text-zinc-400">Estacionamiento</p>
                  <p className="mt-1 font-bold">
                    {property.parking ? "Sí" : "No"}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/40 p-4">
                  <p className="text-sm text-zinc-400">Mascotas</p>
                  <p className="mt-1 font-bold">
                    {property.pets ? "Sí" : "Consultar"}
                  </p>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                className="mt-6 block rounded-2xl bg-white px-6 py-4 text-center font-bold text-black transition hover:scale-105"
              >
                Iniciar preevaluación por WhatsApp
              </a>
            </aside>
          </div>

          <section className="mt-10 rounded-[36px] border border-white/10 bg-white/5 p-8">
            <h2 className="text-3xl font-black">
              Descripción
            </h2>

            <p className="mt-5 leading-relaxed text-zinc-300">
              {property.description ||
                "Departamento disponible para arriendo. Excelente alternativa para quienes buscan una opción bien ubicada, con buena conectividad y proceso de postulación guiado."}
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}