import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext(null);

/**
 * Theme Provider Component
 * Always applies dark theme to the document
 */
export function ThemeProvider({ children }) {
  useEffect(() => {
    // Always ensure dark theme is applied
    const root = document.documentElement;
    root.classList.add('dark');
    // Remove any light theme classes if they exist
    root.classList.remove('light');
  }, []);

  const value = {
    theme: 'dark',
    mounted: true,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return default dark theme if context is not available
    return { theme: 'dark', mounted: true };
  }
  return context;
}

