"use client";

import { useState } from "react";
import { Navbar } from "@/src/components/Navbar";
import { properties } from "@/src/data/properties";
import { PropertyCard } from "@/src/components/PropertyCard";
import { questions } from "@/src/data/questions";
import { QuestionCard } from "@/src/components/QuestionCard";

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      <Navbar />

      {/* Glow Effects */}
      <div className="absolute left-[-200px] top-[-200px] h-[500px] w-[500px] rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl" />

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">

        <div className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-xl">
          La nueva experiencia para encontrar arriendo en Chile
        </div>

        <h1 className="max-w-5xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
          Encuentra tu próximo{" "}
          <span className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
            hogar
          </span>{" "}
          en minutos.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl">
          MatchHome conecta personas con departamentos ideales usando una experiencia rápida, visual e inteligente.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">

          <button className="rounded-2xl bg-white px-8 py-4 font-semibold text-black transition hover:scale-105">
            Comenzar ahora
          </button>

          <button className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-semibold backdrop-blur-xl transition hover:bg-white/10">
            Explorar propiedades
          </button>

        </div>

        {/* Properties */}
        <div className="mt-20 w-full max-w-5xl rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">

          <div className="grid gap-6 md:grid-cols-3">

            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                title={property.title}
                location={property.location}
                price={property.price}
                match={property.match}
                gradient={property.gradient}
              />
            ))}

          </div>

        </div>
             <div className="mt-32 flex flex-col items-center">

  <QuestionCard
    question={questions[currentQuestion].question}
    options={questions[currentQuestion].options}
    onSelect={(option) => {

      setAnswers([...answers, option]);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }

    }}
  />

  <div className="mt-10 flex flex-wrap justify-center gap-3 text-zinc-400">

    {answers.map((answer, index) => (
      <p
        key={index}
        className="rounded-xl bg-white/5 px-4 py-2"
      >
        {answer}
      </p>
    ))}

  </div>


</div>
      </section>

    </main>
  );
}