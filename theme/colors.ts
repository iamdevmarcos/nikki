export type ColorTheme = Record<
  | "background"
  | "foreground"
  | "primary"
  | "primaryForeground"
  | "secondary"
  | "secondaryForeground"
  | "muted"
  | "mutedForeground"
  | "accent"
  | "accentForeground"
  | "border"
  | "input"
  | "ring"
  | "cadet-gray"
  | "rich-black"
  | "hunyadi-yellow",
  string
>;

export const colors: Record<"light" | "dark", ColorTheme> = {
  light: {
    background: "#f5f5f5",
    foreground: "#111111",
    primary: "#ffffff",
    primaryForeground: "#111111",
    secondary: "#111111",
    secondaryForeground: "#ffffff",
    muted: "#e5e5e5",
    mutedForeground: "#555555",
    accent: "#e5e5e5",
    accentForeground: "#111111",
    border: "#cccccc",
    input: "#cccccc",
    ring: "#111111",
    "cadet-gray": "#91A0AA",
    "rich-black": "#071011",
    "hunyadi-yellow": "#e6a835",
  },
  dark: {
    background: "#071011",
    foreground: "#ffffff",
    primary: "#ffffff",
    primaryForeground: "#071011",
    secondary: "#071011",
    secondaryForeground: "#ffffff",
    muted: "#262626",
    mutedForeground: "#a3a3a3",
    accent: "#262626",
    accentForeground: "#ffffff",
    border: "#333333",
    input: "#333333",
    ring: "#ffffff",
    "cadet-gray": "#91A0AA",
    "rich-black": "#071011",
    "hunyadi-yellow": "#e6a835",
  },
};
