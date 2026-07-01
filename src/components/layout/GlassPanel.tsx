import type { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  variant?: "panel" | "card" | "input";
}

const variants = {
  panel: "glass-panel rounded-3xl",
  card: "glass-card rounded-2xl",
  input: "glass-input rounded-xl",
};

export function GlassPanel({
  children,
  className = "",
  variant = "panel",
}: GlassPanelProps) {
  return (
    <div className={`${variants[variant]} ${className}`}>{children}</div>
  );
}
