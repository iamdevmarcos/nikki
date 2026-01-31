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
  | "ring",
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
  },
  dark: {
    background: "#111111",
    foreground: "#ffffff",
    primary: "#ffffff",
    primaryForeground: "#111111",
    secondary: "#111111",
    secondaryForeground: "#ffffff",
    muted: "#262626",
    mutedForeground: "#a3a3a3",
    accent: "#262626",
    accentForeground: "#ffffff",
    border: "#333333",
    input: "#333333",
    ring: "#ffffff",
  },
};
