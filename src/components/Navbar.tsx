export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        <h1 className="text-xl font-bold tracking-tight">
          MatchHome
        </h1>

        <nav className="hidden gap-8 md:flex">
          <a href="#" className="text-sm text-zinc-300 transition hover:text-white">
            Explorar
          </a>

          <a href="#" className="text-sm text-zinc-300 transition hover:text-white">
            Cómo funciona
          </a>

          <a href="#" className="text-sm text-zinc-300 transition hover:text-white">
            Contacto
          </a>
        </nav>

        <button className="rounded-xl bg-white px-5 py-2 text-sm font-medium text-black transition hover:scale-105">
          Ingresar
        </button>

      </div>
    </header>
  );
}