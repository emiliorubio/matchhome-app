"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, Train } from "lucide-react";

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
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const message = encodeURIComponent(
    `Hola, me interesa esta propiedad:\n\n${title}\n${typology || ""}\n${location}\n${price}\n\nQuiero agendar una visita.`
  );

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${message}`
    : "#";

  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{
        duration: 0.2,
      }}
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
        <h3 className="text-xl font-bold leading-tight">
          {title}
        </h3>

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
          <span className="text-xl font-semibold">
            {price}
          </span>

          <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
            {match}% match
          </span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          className="mt-5 block rounded-2xl bg-white px-5 py-3 text-center font-semibold text-black transition hover:scale-105"
        >
          Agendar visita
        </a>
      </div>

      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-cyan-500/5" />
      </div>
    </motion.div>
  );
}