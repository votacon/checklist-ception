import { createContext, useContext } from "react";
import type { Theme } from "../types/theme";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
  isBarebones: boolean;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: "fancy",
  setTheme: () => {},
  cycleTheme: () => {},
  isBarebones: false,
});

export function useTheme() {
  return useContext(ThemeContext);
}
