"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Navbar } from "@/src/components/Navbar";
import { PropertyCard } from "@/src/components/PropertyCard";
import { QuestionCard } from "@/src/components/QuestionCard";
import { ProgressBar } from "@/src/components/ProgressBar";
import { SearchBar } from "@/src/components/SearchBar";

import { properties } from "@/src/data/properties";
import { questions } from "@/src/data/questions";

export default function Home() {

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState<string[]>([]);

  const [favorites, setFavorites] = useState<number[]>([]);

  const [search, setSearch] = useState("");

  const isFinished = currentQuestion >= questions.length;

  const progress = Math.round(
    (currentQuestion / questions.length) * 100
  );

  const matchedProperties = useMemo(() => {

    const budgetAnswer = answers[0];
    const locationAnswer = answers[1];
    const petsAnswer = answers[2];

    return properties.filter((property) => {

      const matchesBudget =
        !budgetAnswer ||
        property.budget === budgetAnswer;

      const matchesLocation =
        !locationAnswer ||
        property.location === locationAnswer;

      const matchesPets =
        !petsAnswer ||
        (petsAnswer === "Sí"
          ? property.pets
          : true);

      const matchesSearch =
        property.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        property.location
          .toLowerCase()
          .includes(search.toLowerCase());

      return (
        matchesBudget &&
        matchesLocation &&
        matchesPets &&
        matchesSearch
      );

    });

  }, [answers, search]);

  const toggleFavorite = (id: number) => {

    setFavorites((prev) => {

      if (prev.includes(id)) {
        return prev.filter((fav) => fav !== id);
      }

      return [...prev, id];

    });

  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      <Navbar />

      {/* Glow */}
      <div className="absolute left-[-200px] top-[-200px] h-[500px] w-[500px] rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl" />

      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">

        {/* Hero */}
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

        {/* Search */}
        <div className="mt-14 w-full flex justify-center">
          <SearchBar
            value={search}
            onChange={setSearch}
          />
        </div>

        {/* Featured */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12 w-full max-w-5xl rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl"
        >

          <div className="grid gap-6 md:grid-cols-3">

            {matchedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                title={property.title}
                location={property.location}
                price={`$${property.price.toLocaleString("es-CL")}`}
                match={property.match}
                gradient={property.gradient}
                favorite={favorites.includes(property.id)}
                onFavorite={() => toggleFavorite(property.id)}
              />
            ))}

          </div>

          {matchedProperties.length === 0 && (

            <div className="py-20 text-center text-zinc-400">

              No encontramos propiedades con esos filtros.

            </div>

          )}

        </motion.div>

        {/* Onboarding */}
        {!isFinished && (

          <div className="mt-32 flex w-full flex-col items-center">

            <ProgressBar progress={progress} />

            <AnimatePresence mode="wait">

              <motion.div
                key={currentQuestion}
                initial={{
                  opacity: 0,
                  x: 60,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -60,
                }}
                transition={{
                  duration: 0.35,
                }}
                className="mt-10"
              >

                <QuestionCard
                  question={questions[currentQuestion].question}
                  options={questions[currentQuestion].options}
                  onSelect={(option) => {

                    setAnswers([...answers, option]);

                    setTimeout(() => {
                      setCurrentQuestion(currentQuestion + 1);
                    }, 200);

                  }}
                />

              </motion.div>

            </AnimatePresence>

            <div className="mt-10 flex flex-wrap justify-center gap-3 text-zinc-400">

              {answers.map((answer, index) => (
                <motion.p
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  key={index}
                  className="rounded-xl bg-white/5 px-4 py-2"
                >
                  {answer}
                </motion.p>
              ))}

            </div>

          </div>

        )}

      </section>

    </main>
  );
}