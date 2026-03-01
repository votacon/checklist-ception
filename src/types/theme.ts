export type Theme = "barebones" | "fancy" | "vibrant" | "pastel" | "playful" | "neon";

export const THEME_ORDER: Theme[] = [
  "barebones",
  "fancy",
  "vibrant",
  "pastel",
  "playful",
  "neon",
];

export const THEME_LABELS: Record<Theme, string> = {
  barebones: "Barebones",
  fancy: "Fancy",
  vibrant: "Vibrant",
  pastel: "Pastel",
  playful: "Playful",
  neon: "Neon",
};
