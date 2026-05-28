type ProgressBarProps = {
  progress: number;
};

export function ProgressBar({
  progress,
}: ProgressBarProps) {

  return (
    <div className="w-full max-w-2xl">

      <div className="mb-3 flex items-center justify-between">

        <span className="text-sm text-zinc-400">
          Compatibilidad
        </span>

        <span className="text-sm font-semibold text-white">
          {progress}%
        </span>

      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/10">

        <div
          className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

    </div>
  );
}