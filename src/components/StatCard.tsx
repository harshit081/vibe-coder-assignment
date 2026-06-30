interface StatCardProps {
  label: string;
  value: string;
  accent?: string;
  large?: boolean;
}

export function StatCard({ label, value, accent, large }: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 text-left transition-transform hover:-translate-y-0.5 ${
        large ? "col-span-2 sm:col-span-1" : ""
      }`}
      style={
        accent
          ? {
              boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.08), 0 0 40px -12px ${accent}`,
            }
          : undefined
      }
    >
      <p className="text-xs uppercase tracking-wider text-white/50 mb-1">
        {label}
      </p>
      <p
        className={`font-bold text-white tabular-nums ${
          large ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
