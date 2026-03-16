import React, { createContext, useContext, useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { DarkPalette, LightPalette, type AppPalette } from '@/constants/theme';

type ColorMode = 'dark' | 'light';

interface ThemeContextValue {
  colorMode: ColorMode;
  palette: AppPalette;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colorMode:   'dark',
  palette:     DarkPalette,
  isDark:      true,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [colorMode, setColorMode] = useState<ColorMode>(systemScheme === 'light' ? 'light' : 'dark');

  const toggleTheme = useCallback(() => {
    setColorMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const palette = colorMode === 'dark' ? DarkPalette : LightPalette;

  return (
    <ThemeContext.Provider value={{ colorMode, palette, isDark: colorMode === 'dark', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
