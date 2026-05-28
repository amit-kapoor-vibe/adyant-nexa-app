"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Lazy initializer: runs once on mount, avoids setState-in-effect lint error
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nexa-theme") as Theme;
      if (saved === "light" || saved === "dark") return saved;
    }
    return "dark";
  });
  // Use a ref instead of state to track mount status — avoids setState-in-effect lint error
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;

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
  }, [theme]);

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
