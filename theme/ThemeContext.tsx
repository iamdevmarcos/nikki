import { useColorScheme } from "nativewind";
import { createContext, useContext, useEffect } from "react";
import { View } from "react-native";
import { colors, ColorTheme } from "./colors";

interface ThemeContextType {
  isDark: boolean;
  colorScheme: "light" | "dark";
  colors: ColorTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    if (colorScheme !== "dark") {
      setColorScheme("dark");
    }
  }, [colorScheme, setColorScheme]);

  const activeColorScheme = "dark";

  return (
    <ThemeContext.Provider
      value={{
        isDark: true,
        colorScheme: "dark",
        colors: colors["dark"],
      }}
    >
      <View style={{ flex: 1 }} className="dark">
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
