type QuestionCardProps = {
  question: string;
  options: string[];
  onSelect: (option: string) => void;
};

export function QuestionCard({
  question,
  options,
  onSelect,
}: QuestionCardProps) {
  return (
    <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <h2 className="text-3xl font-bold">
        {question}
      </h2>

      <div className="mt-8 grid gap-4">

        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className="rounded-2xl border border-white/10 bg-black/40 px-6 py-5 text-left transition hover:border-fuchsia-500 hover:bg-white/10"
          >
            {option}
          </button>
        ))}

      </div>

    </div>
  );
}