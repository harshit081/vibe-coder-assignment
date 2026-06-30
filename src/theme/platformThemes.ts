import type { Platform } from "@/types";

export interface PlatformTheme {
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  glow: string;
  badge: string;
  ring: string;
  mesh: string;
}

export const platformThemes: Record<Platform, PlatformTheme> = {
  instagram: {
    label: "Instagram",
    primary: "#E1306C",
    secondary: "#F77737",
    accent: "#833AB4",
    gradient:
      "linear-gradient(135deg, #833AB4 0%, #E1306C 45%, #F77737 100%)",
    glow: "rgba(225, 48, 108, 0.45)",
    badge: "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400",
    ring: "ring-pink-500/40",
    mesh: "from-purple-950 via-fuchsia-950 to-orange-950",
  },
  youtube: {
    label: "YouTube",
    primary: "#FF0000",
    secondary: "#CC0000",
    accent: "#FFFFFF",
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #FF0000 100%)",
    glow: "rgba(255, 0, 0, 0.4)",
    badge: "bg-red-600",
    ring: "ring-red-500/40",
    mesh: "from-zinc-950 via-red-950 to-black",
  },
  tiktok: {
    label: "TikTok",
    primary: "#00F2EA",
    secondary: "#FF0050",
    accent: "#FFFFFF",
    gradient:
      "linear-gradient(135deg, #00F2EA 0%, #010101 50%, #FF0050 100%)",
    glow: "rgba(255, 0, 80, 0.35)",
    badge: "bg-gradient-to-r from-cyan-400 to-pink-500",
    ring: "ring-cyan-400/30",
    mesh: "from-cyan-950 via-zinc-950 to-pink-950",
  },
};

export function getPlatformTheme(platform: Platform): PlatformTheme {
  return platformThemes[platform];
}
