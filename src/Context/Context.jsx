import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => JSON.parse(localStorage.getItem("theme")) ?? true);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
    document.documentElement.dataset.bsTheme = theme ? "light" : "dark";
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);