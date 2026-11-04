import { IconStar } from "./icons";

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  const row = (className: string) => (
    <div className={`flex gap-[2px] ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <IconStar key={i} width={size} height={size} />
      ))}
    </div>
  );
  return (
    <span className="relative inline-flex align-middle" aria-label={`Rated ${rating} out of 5`}>
      {row("text-sand")}
      <span className="absolute inset-0 overflow-hidden text-gold" style={{ width: `${pct}%` }}>
        {row("text-gold")}
      </span>
    </span>
  );
}
