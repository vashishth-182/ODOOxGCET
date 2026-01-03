import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

/**
 * Theme Toggle Component
 * 
 * Accessible theme switcher with:
 * - Keyboard navigation
 * - ARIA labels
 * - Smooth icon transitions
 * - Visible focus states
 */
export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className="w-9 h-9 rounded-xl flex items-center justify-center bg-neutral-100 border border-neutral-200"
        aria-label="Toggle theme"
        disabled
      >
        <div className="w-4 h-4" />
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="
        relative w-9 h-9 rounded-xl
        flex items-center justify-center
        bg-neutral-100 border border-neutral-200
        hover:bg-neutral-200 hover:border-neutral-300
        focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-white
        transition-all duration-200
        active:scale-95
      "
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      type="button"
    >
      {/* Sun icon - visible in dark mode */}
      <Sun
        className={`
          absolute w-4 h-4 transition-all duration-300 ease-in-out
          text-neutral-700
          ${isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}
        `}
        aria-hidden="true"
      />
      
      {/* Moon icon - visible in light mode */}
      <Moon
        className={`
          absolute w-4 h-4 transition-all duration-300 ease-in-out
          text-neutral-700
          ${!isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}
        `}
        aria-hidden="true"
      />
    </button>
  );
}

