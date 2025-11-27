import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "anvistride_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    if (saved === "light" || saved === "dark") {
      // On mobile, if saved theme is dark but user hasn't explicitly enabled it, force light
      const isMobile = window.innerWidth <= 768;
      if (isMobile && saved === "dark") {
        // Check if dark mode was explicitly enabled (we'll use a separate flag)
        const darkEnabled = localStorage.getItem("anvistride_dark_enabled");
        if (darkEnabled !== "true") {
          return "light";
        }
      }
      return saved;
    }
    // On mobile, default to light mode (don't check system preference)
    // Only check system preference on desktop
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      return "light";
    }
    // Check system preference only on desktop
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    const isMobile = window.innerWidth <= 768;
    
    // On mobile, force light mode unless explicitly enabled
    if (isMobile) {
      const darkEnabled = localStorage.getItem("anvistride_dark_enabled") === "true";
      if (theme === "dark" && darkEnabled) {
        root.classList.add("dark");
        root.setAttribute("data-dark-enabled", "true");
      } else {
        // Force light mode on mobile
        root.classList.remove("dark");
        root.removeAttribute("data-dark-enabled");
      }
    } else {
      // Desktop: normal behavior
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // On mount, ensure mobile starts in light mode (remove dark class immediately)
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      const darkEnabled = localStorage.getItem("anvistride_dark_enabled") === "true";
      const root = document.documentElement;
      if (!darkEnabled) {
        // Immediately remove dark class on mobile if not explicitly enabled
        root.classList.remove("dark");
        root.removeAttribute("data-dark-enabled");
      }
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      // On mobile, mark dark mode as explicitly enabled if user toggles to dark
      const isMobile = window.innerWidth <= 768;
      if (isMobile && newTheme === "dark") {
        localStorage.setItem("anvistride_dark_enabled", "true");
      } else if (isMobile && newTheme === "light") {
        localStorage.removeItem("anvistride_dark_enabled");
      }
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
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

