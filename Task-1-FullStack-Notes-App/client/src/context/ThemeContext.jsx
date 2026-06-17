import { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./themeContext";

const storageKey = "notes-theme";

const resolveTheme = (themePreference) => {
  if (themePreference === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return themePreference;
};

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(storageKey);

  if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
    return savedTheme;
  }

  return "system";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolveTheme(theme) === "dark");
    localStorage.setItem(storageKey, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (resolveTheme(currentTheme) === "dark" ? "light" : "dark"));
  };

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
