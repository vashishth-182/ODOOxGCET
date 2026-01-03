# Dark/Light Theme Implementation

This document explains the dark/light theme toggle implementation for Dayflow HRMS.

## Overview

The theme system uses Tailwind CSS's class-based dark mode strategy with React context for state management. The theme preference is persisted to localStorage and respects system preferences on first load.

## Key Features

✅ **Instant toggling** with smooth transitions  
✅ **localStorage persistence** - remembers user preference  
✅ **System preference detection** - respects `prefers-color-scheme` on first load  
✅ **No FOUC** - theme applied before React hydration  
✅ **Accessible** - keyboard navigable with proper ARIA labels  
✅ **Production-ready** - clean, maintainable code  

## Architecture

### 1. Tailwind Configuration

`tailwind.config.js`:
```js
darkMode: 'class', // Enables class-based dark mode
```

The theme is controlled by the `dark` class on the `<html>` element.

### 2. Theme Context

`src/contexts/ThemeContext.jsx`:
- Manages theme state (`light` | `dark`)
- Persists to localStorage
- Applies theme class to document root
- Listens for system preference changes

**Key Functions:**
- `getInitialTheme()` - Determines initial theme from localStorage or system
- `ThemeProvider` - React context provider
- `useTheme()` - Hook to access theme state

### 3. FOUC Prevention

`index.html` contains an inline script that runs **before** React hydration:

```html
<script>
  (function() {
    // Immediately apply theme to prevent flash
    const theme = getInitialTheme();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```

This ensures the correct theme is applied instantly, preventing any flash of incorrect theme.

### 4. Theme Toggle Component

`src/components/ThemeToggle.jsx`:
- Icon-based toggle (Sun/Moon)
- Smooth icon transitions
- Fully accessible (keyboard, ARIA, focus states)
- Prevents hydration mismatch

## Usage

### Basic Usage

The theme toggle is automatically integrated into the Header component. Users can click it to toggle between light and dark modes.

### Programmatic Usage

```jsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme, setTheme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
      <button onClick={() => setTheme('light')}>Light Mode</button>
    </div>
  );
}
```

### Using Dark Mode Classes

In your components, use Tailwind's `dark:` prefix:

```jsx
<div className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
  Content that adapts to theme
</div>
```

## Design System

### Dark Mode Colors

The dark mode uses a calm, professional palette:
- **Background**: `neutral-900` (#151311) - Not pure black, easier on eyes
- **Surface**: `neutral-800` (#1a1816) - Subtle contrast
- **Text**: `neutral-100` (#f5f3f1) - High contrast, readable
- **Borders**: `neutral-700` - Subtle, not harsh

### Transitions

All theme changes use smooth transitions (200ms) for:
- Background colors
- Text colors
- Borders
- Shadows

## Accessibility

### Keyboard Navigation
- Theme toggle is fully keyboard navigable
- Tab to focus, Enter/Space to activate

### ARIA Labels
- `aria-label`: Describes the action ("Switch to light mode")
- `aria-pressed`: Indicates current state

### Focus States
- Visible focus ring (2px, accent color)
- High contrast for visibility

## Testing

1. **Toggle theme** - Should switch instantly with smooth transitions
2. **Refresh page** - Theme should persist
3. **Clear localStorage** - Should respect system preference
4. **Keyboard navigation** - Tab to toggle, Enter/Space to activate
5. **System preference change** - Should update if no manual preference set

## File Structure

```
src/
├── contexts/
│   └── ThemeContext.jsx      # Theme state management
├── components/
│   └── ThemeToggle.jsx       # Toggle button component
├── utils/
│   └── theme-script.js       # FOUC prevention script (reference)
index.html                     # Contains inline theme script
tailwind.config.js            # Dark mode configuration
src/index.css                 # Dark mode styles
```

## Customization

### Changing Default Theme

Edit `getInitialTheme()` in `ThemeContext.jsx`:
```js
return 'dark'; // Always start with dark mode
```

### Custom Colors

Update color palette in `tailwind.config.js` and add dark variants in `src/index.css`.

### Toggle Position

The toggle is in `src/components/Header.jsx`. Move it wherever needed.

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ iOS Safari
- ✅ Android Chrome

Requires JavaScript enabled (expected for React apps).

