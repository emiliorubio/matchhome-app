"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Navbar } from "@/src/components/Navbar";
import { PropertyCard } from "@/src/components/PropertyCard";
import { QuestionCard } from "@/src/components/QuestionCard";
import { ProgressBar } from "@/src/components/ProgressBar";
import { SearchBar } from "@/src/components/SearchBar";

import { questions } from "@/src/data/questions";
import { getProperties } from "@/src/services/properties";
import { Property } from "@/src/types/property";

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(true);

  const isFinished = currentQuestion >= questions.length;
  const isSearching = search.trim().length > 0;

  const progress = Math.round(
    (currentQuestion / questions.length) * 100
  );

  useEffect(() => {
    async function loadProperties() {
      const data = await getProperties();
      setProperties(data);
      setLoading(false);
    }

    loadProperties();
  }, []);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("matchhome-favorites");

    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "matchhome-favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  useEffect(() => {
    if (isSearching) {
      setIsOnboardingOpen(false);
    }
  }, [isSearching]);

  const matchedProperties = useMemo(() => {
    const budgetAnswer = answers[0];
    const locationAnswer = answers[1];
    const parkingAnswer = answers[2];
    const cleanSearch = normalizeText(search.trim());

    return properties.filter((property) => {
      const matchesBudget =
        !budgetAnswer || isSearching || property.budget === budgetAnswer;

      const matchesLocation =
        !locationAnswer || isSearching || property.location === locationAnswer;

      const matchesParking =
        !parkingAnswer ||
        isSearching ||
        (parkingAnswer === "Sí" ? property.parking : true);

      const searchableText = normalizeText(
        [
          property.title,
          property.location,
          property.address || "",
          property.metro || "",
          property.typology || "",
          property.project || "",
        ].join(" ")
      );

      const matchesSearch =
        !cleanSearch || searchableText.includes(cleanSearch);

      return (
        matchesBudget &&
        matchesLocation &&
        matchesParking &&
        matchesSearch
      );
    });
  }, [properties, answers, search, isSearching]);

  const featuredProperties = matchedProperties.filter(
    (property) => property.featured
  );

  const normalProperties = matchedProperties.filter(
    (property) => !property.featured
  );

  const favoriteProperties = properties.filter((property) =>
    favorites.includes(property.id)
  );

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((fav) => fav !== id);
      }

      return [...prev, id];
    });
  };

  const resetOnboarding = () => {
    setAnswers([]);
    setCurrentQuestion(0);
    setSearch("");
    setIsOnboardingOpen(true);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <Navbar />

      <div className="absolute left-[-200px] top-[-200px] h-[500px] w-[500px] rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl" />

      <section className="relative flex min-h-screen flex-col items-center px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-10 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-xl"
        >
          La nueva experiencia para encontrar arriendo en Chile
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-8 max-w-5xl text-5xl font-black leading-tight tracking-tight md:text-7xl"
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
          MatchHome conecta personas con departamentos ideales usando una
          experiencia rápida, visual e inteligente.
        </motion.p>

        <div className="mt-12 flex w-full justify-center">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {isSearching && (
          <button
            onClick={() => {
              setSearch("");
              setIsOnboardingOpen(true);
            }}
            className="mt-4 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
          >
            Limpiar búsqueda y volver al match
          </button>
        )}

        <div className="mt-10 w-full max-w-3xl rounded-[32px] border border-cyan-500/20 bg-white/5 p-5 backdrop-blur-xl">
          <button
            onClick={() => setIsOnboardingOpen((prev) => !prev)}
            className="flex w-full items-center justify-between gap-4 text-left"
          >
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
                Match rápido
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Encuentra opciones según tu perfil
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                {isSearching
                  ? "Búsqueda activa: el match está minimizado."
                  : isFinished
                  ? "Matching completado."
                  : "Responde 3 preguntas rápidas."}
              </p>
            </div>

            <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-zinc-300">
              {isOnboardingOpen ? "Ocultar" : "Mostrar"}
            </span>
          </button>

          <AnimatePresence>
            {isOnboardingOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 flex flex-col items-center">
                  {!isFinished ? (
                    <>
                      <ProgressBar progress={progress} />

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentQuestion}
                          initial={{ opacity: 0, x: 60 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -60 }}
                          transition={{ duration: 0.35 }}
                          className="mt-8"
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

                      <div className="mt-8 flex flex-wrap justify-center gap-3 text-zinc-400">
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
                    </>
                  ) : (
                    <div className="rounded-[28px] border border-green-500/20 bg-white/5 p-6 text-center">
                      <div className="mb-4 inline-flex rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-400">
                        Matching completado
                      </div>

                      <h3 className="text-2xl font-black">
                        Encontramos {matchedProperties.length} propiedades compatibles.
                      </h3>

                      <p className="mt-3 text-zinc-400">
                        Puedes buscar, ver resultados o repetir el match.
                      </p>

                      <button
                        onClick={resetOnboarding}
                        className="mt-5 rounded-2xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
                      >
                        Repetir búsqueda
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {featuredProperties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 w-full max-w-6xl rounded-[32px] border border-yellow-400/30 bg-yellow-400/5 p-6 text-left shadow-2xl shadow-yellow-500/10 backdrop-blur-xl"
          >
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.25em] text-yellow-300">
                Promociones
              </p>

              <h2 className="mt-2 text-3xl font-black">
                🔥 Destacadas de la semana
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Propiedades priorizadas por campaña, promoción o disponibilidad.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {featuredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  location={property.location}
                  price={`$${property.price.toLocaleString("es-CL")}`}
                  match={property.match}
                  gradient="from-yellow-400 to-orange-500"
                  favorite={favorites.includes(property.id)}
                  onFavorite={() => toggleFavorite(property.id)}
                  typology={property.typology}
                  metro={property.metro}
                />
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-10 w-full max-w-6xl rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-6 flex flex-col gap-4 text-left md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {isSearching
                  ? "Resultados de búsqueda"
                  : "Propiedades recomendadas"}
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                {normalProperties.length} resultados disponibles
              </p>
            </div>

            <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-zinc-300">
              {favorites.length} favoritos
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-zinc-400">
              Cargando propiedades...
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {normalProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  location={property.location}
                  price={`$${property.price.toLocaleString("es-CL")}`}
                  match={property.match}
                  gradient={property.gradient}
                  favorite={favorites.includes(property.id)}
                  onFavorite={() => toggleFavorite(property.id)}
                  typology={property.typology}
                  metro={property.metro}
                />
              ))}
            </div>
          )}

          {!loading && matchedProperties.length === 0 && (
            <div className="py-20 text-center text-zinc-400">
              No encontramos propiedades con esos filtros.
            </div>
          )}
        </motion.div>

        {favoriteProperties.length > 0 && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 w-full max-w-6xl rounded-[32px] border border-red-500/20 bg-white/5 p-6 text-left backdrop-blur-xl"
          >
            <h2 className="text-2xl font-bold">
              Tus favoritos guardados
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              Estas propiedades quedan guardadas aunque recargues la página.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {favoriteProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  location={property.location}
                  price={`$${property.price.toLocaleString("es-CL")}`}
                  match={property.match}
                  gradient={property.gradient}
                  favorite={favorites.includes(property.id)}
                  onFavorite={() => toggleFavorite(property.id)}
                  typology={property.typology}
                  metro={property.metro}
                />
              ))}
            </div>
          </motion.div>
        )}
      </section>
    </main>
  );
}