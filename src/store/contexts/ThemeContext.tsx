import { createContext } from "react";

interface ThemeContextType {
  theme: string;
  setTheme: (value: string) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
});
