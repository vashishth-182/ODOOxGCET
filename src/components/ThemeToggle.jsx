import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Accessible theme toggle button
 * Features:
 * - Keyboard navigable
 * - ARIA labels
 * - Smooth icon transitions
 * - Visible focus states
 */
export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        className="w-10 h-10 rounded-xl flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
        aria-label="Toggle theme"
        disabled
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="
        relative w-10 h-10 rounded-xl 
        flex items-center justify-center 
        bg-neutral-100 dark:bg-neutral-800 
        border border-neutral-200 dark:border-neutral-700
        hover:bg-neutral-200 dark:hover:bg-neutral-700
        focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900
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
          absolute w-5 h-5 transition-all duration-300 ease-in-out
          text-neutral-700 dark:text-neutral-300
          ${isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}
        `}
        aria-hidden="true"
      />
      
      {/* Moon icon - visible in light mode */}
      <Moon
        className={`
          absolute w-5 h-5 transition-all duration-300 ease-in-out
          text-neutral-700 dark:text-neutral-300
          ${!isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}
        `}
        aria-hidden="true"
      />
    </button>
  );
}

