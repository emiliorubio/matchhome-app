type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({
  value,
  onChange,
}: SearchBarProps) {

  return (
    <div className="w-full max-w-3xl">

      <input
        type="text"
        placeholder="Buscar comuna o propiedad..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white outline-none backdrop-blur-xl transition focus:border-fuchsia-500"
      />

    </div>
  );
}