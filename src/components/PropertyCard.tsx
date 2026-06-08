"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, Train, X } from "lucide-react";

type PropertyCardProps = {
  title: string;
  location: string;
  price: string;
  match: number;
  gradient: string;
  favorite?: boolean;
  onFavorite?: () => void;
  typology?: string | null;
  metro?: string | null;
};

export function PropertyCard({
  title,
  location,
  price,
  match,
  gradient,
  favorite,
  onFavorite,
  typology,
  metro,
}: PropertyCardProps) {
  const [showModal, setShowModal] = useState(false);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const message = encodeURIComponent(
    `Hola, me interesa esta propiedad:\n\n${title}\n${typology || ""}\n${location}\n${price}\n\nQuiero iniciar la preevaluación para agendar visita.`
  );

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${message}`
    : "#";

  return (
    <>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 p-5"
      >
        <button
          onClick={onFavorite}
          className="absolute right-4 top-4 z-20 rounded-full bg-black/40 p-2 backdrop-blur-xl transition hover:scale-110"
        >
          <Heart
            className={`h-5 w-5 transition ${
              favorite ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>

        <div className={`h-48 rounded-2xl bg-gradient-to-br ${gradient}`} />

        <div className="mt-5">
          <h3 className="text-xl font-bold leading-tight">{title}</h3>

          <p className="mt-2 text-sm font-medium text-zinc-300">
            {typology || "Tipología por confirmar"}
          </p>

          <div className="mt-3 flex items-center gap-2 text-zinc-400">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>

          {metro && (
            <div className="mt-2 flex items-center gap-2 text-zinc-400">
              <Train className="h-4 w-4" />
              <span>{metro}</span>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xl font-semibold">{price}</span>

            <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
              {match}% match
            </span>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="mt-5 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-5 py-3 font-bold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.02]"
          >
            Quiero agendar visita
          </button>
        </div>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[32px] border border-white/10 bg-zinc-950 p-6 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
                  Preevaluación
                </p>

                <h2 className="mt-3 text-3xl font-black">
                  Antes de agendar la visita
                </h2>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-5 text-zinc-400">
              Para evitar pérdidas de tiempo, las visitas se agendan una vez
              realizada una preevaluación básica del postulante.
            </p>

            <div className="mt-6 rounded-2xl bg-white/5 p-5 text-sm text-zinc-300">
              <p className="font-semibold text-white">
                Requisitos habituales:
              </p>

              <ul className="mt-3 space-y-2">
                <li>• Renta compatible con el valor del arriendo.</li>
                <li>• Documentación laboral o tributaria vigente.</li>
                <li>• Cédula de identidad vigente.</li>
                <li>• No registrar antecedentes comerciales complejos.</li>
                <li>• Aval o codeudor si la evaluación lo requiere.</li>
              </ul>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              className="mt-6 block rounded-2xl bg-white px-6 py-4 text-center font-bold text-black transition hover:scale-105"
            >
              Continuar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
}