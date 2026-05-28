"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { Navbar } from "@/src/components/Navbar";
import { PropertyCard } from "@/src/components/PropertyCard";
import { QuestionCard } from "@/src/components/QuestionCard";

import { properties } from "@/src/data/properties";
import { questions } from "@/src/data/questions";

export default function Home() {

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const isFinished = currentQuestion >= questions.length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      <Navbar />

      {/* Glow Effects */}
      <div className="absolute left-[-200px] top-[-200px] h-[500px] w-[500px] rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl" />

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-xl"
        >
          La nueva experiencia para encontrar arriendo en Chile
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-5xl text-5xl font-black leading-tight tracking-tight md:text-7xl"
        >
          Encuentra tu próximo{" "}
          <span className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
            hogar
          </span>{" "}
          en minutos.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl"
        >
          MatchHome conecta personas con departamentos ideales usando una experiencia rápida, visual e inteligente.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >

          <button className="rounded-2xl bg-white px-8 py-4 font-semibold text-black transition hover:scale-105">
            Comenzar ahora
          </button>

          <button className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-semibold backdrop-blur-xl transition hover:bg-white/10">
            Explorar propiedades
          </button>

        </motion.div>

        {/* Featured Properties */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-20 w-full max-w-5xl rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl"
        >

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

        </motion.div>

        {/* Onboarding */}
        {!isFinished && (

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mt-32 flex flex-col items-center"
          >

            <QuestionCard
              question={questions[currentQuestion].question}
              options={questions[currentQuestion].options}
              onSelect={(option) => {

                setAnswers([...answers, option]);

                setCurrentQuestion(currentQuestion + 1);

              }}
            />

            <div className="mt-10 flex flex-wrap justify-center gap-3 text-zinc-400">

              {answers.map((answer, index) => (
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={index}
                  className="rounded-xl bg-white/5 px-4 py-2"
                >
                  {answer}
                </motion.p>
              ))}

            </div>

          </motion.div>

        )}

        {/* Matching Results */}
        {isFinished && (

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-32 flex flex-col items-center"
          >

            <div className="max-w-5xl rounded-[32px] border border-fuchsia-500/20 bg-white/5 p-10 text-center backdrop-blur-xl">

              <div className="mb-6 inline-flex rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-400">
                Matching completado
              </div>

              <h2 className="text-5xl font-black leading-tight">
                Encontramos propiedades compatibles contigo.
              </h2>

              <p className="mt-6 text-lg text-zinc-400">
                Analizamos tus preferencias y encontramos opciones ideales para tu perfil.
              </p>

              <div className="mt-10 grid gap-6 md:grid-cols-3">

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

          </motion.div>

        )}

      </section>

    </main>
  );
}