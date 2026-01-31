import { useColorScheme } from "nativewind";
import { createContext, useContext } from "react";
import { View } from "react-native";
import { colors, ColorTheme } from "./colors";

interface ThemeContextType {
  isDark: boolean;
  colorScheme: "light" | "dark";
  colors: ColorTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useColorScheme();
  const activeColorScheme = colorScheme === "dark" ? "dark" : "light";

  return (
    <ThemeContext.Provider
      value={{
        isDark: activeColorScheme === "dark",
        colorScheme: activeColorScheme,
        colors: colors[activeColorScheme],
      }}
    >
      <View style={{ flex: 1 }} className={activeColorScheme}>
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
