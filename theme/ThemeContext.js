import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme } from "./colors";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
const theme = isDarkMode ? darkTheme : lightTheme;
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("theme");
      if (saved) setIsDarkMode(saved === "dark");
    })();
  }, []);

  const toggleTheme = async () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    await AsyncStorage.setItem("theme", next ? "dark" : "light");
  };

  

  return (
  <ThemeContext.Provider
    value={{
      theme,        // ⭐ 一定要有這個
      isDarkMode,
      toggleTheme,
    }}
  >
    {children}
  </ThemeContext.Provider>
);
}

export const useTheme = () => useContext(ThemeContext);
