import { useHeroPortrait } from "@/hooks/useHeroPortrait";

interface HeroPortraitProps {
  username: string;
  fullname: string;
  fallbackSrc: string;
  glowColor: string;
}

export function HeroPortrait({
  username,
  fullname,
  fallbackSrc,
  glowColor,
}: HeroPortraitProps) {
  const { displaySrc, isWikipedia, loading } = useHeroPortrait(
    username,
    fallbackSrc
  );

  return (
    <div className="relative flex justify-center items-end min-h-[280px] sm:min-h-[360px]">
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-48 sm:w-64 sm:h-64 rounded-full blur-3xl opacity-60"
        style={{ background: glowColor }}
        aria-hidden="true"
      />

      {loading ? (
        <div
          className="relative z-10 w-52 h-64 sm:w-64 sm:h-80 rounded-3xl bg-white/5 animate-pulse border border-white/10"
          aria-label={`Loading portrait for ${fullname}`}
        />
      ) : (
        displaySrc && (
          <img
            src={displaySrc}
            alt={fullname}
            className="hero-portrait relative z-10 max-h-[320px] sm:max-h-[420px] w-auto object-contain pointer-events-none select-none"
            draggable={false}
          />
        )
      )}

      {isWikipedia && !loading && (
        <span className="absolute bottom-2 right-2 sm:right-8 z-20 text-[10px] uppercase tracking-widest text-white/30">
          Wiki portrait
        </span>
      )}
    </div>
  );
}
