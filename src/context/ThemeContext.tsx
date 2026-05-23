"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Check persistent user choice from localStorage
    const savedTheme = localStorage.getItem("nexa-theme") as Theme;
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    } else {
      // Default to dark mode as approved
      setTheme("dark");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Apply classes to the document root element
    if (theme === "light") {
      root.classList.add("theme-light");
      root.classList.remove("theme-dark");
      root.style.colorScheme = "light";
    } else {
      root.classList.add("theme-dark");
      root.classList.remove("theme-light");
      root.style.colorScheme = "dark";
    }
    
    localStorage.setItem("nexa-theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Prevent flash or mismatch during SSR hydration by keeping it stable
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === "light" ? "theme-light" : "theme-dark"} style={{ minHeight: "100vh", transition: "background-color 0.4s ease, color 0.4s ease" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
