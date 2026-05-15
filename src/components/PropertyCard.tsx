type PropertyCardProps = {
  title: string;
  location: string;
  price: string;
  match: string;
  gradient: string;
};

export function PropertyCard({
  title,
  location,
  price,
  match,
  gradient,
}: PropertyCardProps) {
  return (
    <div className="rounded-3xl bg-zinc-900 p-5 transition hover:-translate-y-2 hover:shadow-2xl">
      
      <div
        className={`h-48 rounded-2xl bg-gradient-to-br ${gradient}`}
      />

      <h3 className="mt-4 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-2 text-zinc-400">
        {location}
      </p>

      <div className="mt-4 flex items-center justify-between">
        
        <span className="text-lg font-semibold">
          {price}
        </span>

        <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
          {match} match
        </span>

      </div>

    </div>
  );
}