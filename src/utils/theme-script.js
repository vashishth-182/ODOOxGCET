/**
 * Theme initialization script
 * 
 * This script runs BEFORE React hydration to prevent FOUC (Flash of Unstyled Content).
 * It immediately applies the correct theme class to <html> element.
 * 
 * Inline this script in index.html <head> for optimal performance.
 */

(function() {
  const THEME_STORAGE_KEY = 'dayflow-theme';
  
  function getInitialTheme() {
    // Check localStorage first
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch (e) {
      // localStorage may not be available
    }
    
    // Fall back to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  }
  
  const theme = getInitialTheme();
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
})();

