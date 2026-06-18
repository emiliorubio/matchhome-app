"use client";

import { FormEvent, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MapPin, Train, X } from "lucide-react";

import { createLead } from "@/src/services/leads";

type PropertyCardProps = {
  id: number;
  title: string;
  location: string;
  price: string;
  match: number;
  gradient: string;
  favorite?: boolean;
  onFavorite?: () => void;
  typology?: string | null;
  metro?: string | null;
  coverPhoto?: string | null;
  featured?: boolean;
};

export function PropertyCard({
  id,
  title,
  location,
  price,
  match,
  gradient,
  favorite,
  onFavorite,
  typology,
  metro,
  coverPhoto,
  featured,
}: PropertyCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [savingLead, setSavingLead] = useState(false);

  const [leadForm, setLeadForm] = useState({
    name: "",
    phone: "",
    income: "",
    message: "",
  });

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const whatsappMessage = encodeURIComponent(
    `Hola, quiero iniciar preevaluación para esta propiedad:\n\n${title}\n${typology || ""}\n${location}\n${price}\n\nNombre: ${leadForm.name}\nTeléfono: ${leadForm.phone}\nRenta aprox: ${leadForm.income}`
  );

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
    : "#";

  async function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!leadForm.name || !leadForm.phone) {
      alert("Completa tu nombre y teléfono.");
      return;
    }

    setSavingLead(true);

    const createdLead = await createLead({
      property_title: title,
      property_location: location,
      property_price: price,
      name: leadForm.name,
      phone: leadForm.phone,
      income: leadForm.income,
      message: leadForm.message,
    });

    setSavingLead(false);

    if (!createdLead) {
      alert("No se pudo guardar tu solicitud. Intenta nuevamente.");
      return;
    }

    window.open(whatsappUrl, "_blank");
    setShowModal(false);
    setLeadForm({ name: "", phone: "", income: "", message: "" });
  }

  const modal =
    showModal &&
    createPortal(
      <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/90 px-4 py-8">
        <div className="w-full max-w-md rounded-[28px] border border-cyan-400/30 bg-zinc-950 p-6 text-white shadow-2xl shadow-cyan-500/20">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                Preevaluación
              </p>

              <h2 className="mt-3 text-2xl font-black leading-tight">
                Datos para agendar visita
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Las visitas se coordinan después de una preevaluación básica.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="shrink-0 rounded-full bg-white/10 p-2 transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleLeadSubmit} className="mt-6 grid gap-3">
            <input
              value={leadForm.name}
              onChange={(event) =>
                setLeadForm({ ...leadForm, name: event.target.value })
              }
              placeholder="Nombre completo"
              className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-5 py-4 text-white placeholder:text-zinc-500 outline-none focus:border-cyan-400"
            />

            <input
              value={leadForm.phone}
              onChange={(event) =>
                setLeadForm({ ...leadForm, phone: event.target.value })
              }
              placeholder="Teléfono / WhatsApp"
              className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-5 py-4 text-white placeholder:text-zinc-500 outline-none focus:border-cyan-400"
            />

            <input
              value={leadForm.income}
              onChange={(event) =>
                setLeadForm({ ...leadForm, income: event.target.value })
              }
              placeholder="Renta líquida aproximada"
              className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-5 py-4 text-white placeholder:text-zinc-500 outline-none focus:border-cyan-400"
            />

            <textarea
              value={leadForm.message}
              onChange={(event) =>
                setLeadForm({ ...leadForm, message: event.target.value })
              }
              placeholder="Mensaje adicional"
              rows={3}
              className="w-full resize-none rounded-2xl border border-white/10 bg-zinc-900 px-5 py-4 text-white placeholder:text-zinc-500 outline-none focus:border-cyan-400"
            />

            <button
              disabled={savingLead}
              className="rounded-2xl bg-white px-6 py-4 font-bold text-black transition hover:scale-[1.02] disabled:opacity-50"
            >
              {savingLead
                ? "Guardando solicitud..."
                : "Enviar y continuar por WhatsApp"}
            </button>
          </form>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 p-5"
      >
        <button
          type="button"
          onClick={onFavorite}
          className="absolute right-4 top-4 z-30 rounded-full bg-black/40 p-2 backdrop-blur-xl transition hover:scale-110"
        >
          <Heart
            className={`h-5 w-5 transition ${
              favorite ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>

        <Link href={`/propiedad/${id}`} className="relative block">
          {featured && (
            <div className="absolute left-4 top-4 z-20 rounded-full bg-yellow-400 px-4 py-2 text-xs font-black text-black shadow-lg">
              🔥 DESTACADA
            </div>
          )}

          <div className="h-48 w-full overflow-hidden rounded-2xl bg-zinc-800">
            {coverPhoto ? (
              <img
                src={coverPhoto}
                alt={title}
                className="h-full w-full object-contain bg-black"
              />
            ) : (
              <div
                className={`h-full w-full bg-gradient-to-br ${gradient}`}
              />
            )}
          </div>
        </Link>

        <div className="mt-5 flex flex-1 flex-col">
          <Link href={`/propiedad/${id}`}>
            <h3 className="text-xl font-bold leading-tight transition hover:text-cyan-300">
              {title}
            </h3>
          </Link>

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

          <div className="mt-auto grid gap-3 pt-5">
            <Link
              href={`/propiedad/${id}`}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center font-bold text-white transition hover:bg-white/10"
            >
              Ver detalle
            </Link>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-5 py-3 font-bold text-white transition hover:scale-[1.02]"
            >
              Quiero agendar visita
            </button>
          </div>
        </div>
      </motion.div>

      {modal}
    </>
  );
}