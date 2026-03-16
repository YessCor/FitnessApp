/**
 * FitnessApp — Tema Dual (Oscuro + Claro)
 * Acento primario: Indigo eléctrico
 */

import { Platform } from 'react-native';

export type AppPalette = typeof DarkPalette;

// ── Paleta Oscura ────────────────────────────────────────────────────────────
export const DarkPalette = {
  // Fondos
  bgDeep:     '#0D0D0F',
  bgCard:     '#141416',
  bgElevated: '#1C1C1F',
  bgSurface:  '#232328',

  // Acento primario — Indigo eléctrico
  primary:      '#6366F1',
  primaryLight: '#818CF8',
  primaryDark:  '#4F46E5',
  primaryGlow:  'rgba(99,102,241,0.18)',

  // Texto
  textPrimary:   '#F4F4F6',
  textSecondary: '#8B8B9A',
  textMuted:     '#46464F',

  // Utilitarios heredados (compatibilidad)
  secondary:      '#6366F1',
  secondaryLight: '#818CF8',
  secondaryGlow:  'rgba(99,102,241,0.14)',
  accent:         '#6366F1',
  accentGlow:     'rgba(99,102,241,0.14)',

  // Alertas
  success: '#34D399',
  danger:  '#F87171',
  warning: '#FBBF24',

  // Bordes
  border:      '#1F1F24',
  borderLight: '#2A2A32',
};

// ── Paleta Clara ─────────────────────────────────────────────────────────────
export const LightPalette: AppPalette = {
  // Fondos
  bgDeep:     '#F2F2F7',
  bgCard:     '#FFFFFF',
  bgElevated: '#F7F7FA',
  bgSurface:  '#EBEBF0',

  // Acento primario
  primary:      '#4F46E5',
  primaryLight: '#6366F1',
  primaryDark:  '#3730A3',
  primaryGlow:  'rgba(79,70,229,0.12)',

  // Texto
  textPrimary:   '#111118',
  textSecondary: '#6B6B7A',
  textMuted:     '#9898A8',

  // Utilitarios
  secondary:      '#4F46E5',
  secondaryLight: '#6366F1',
  secondaryGlow:  'rgba(79,70,229,0.10)',
  accent:         '#4F46E5',
  accentGlow:     'rgba(79,70,229,0.10)',

  // Alertas
  success: '#10B981',
  danger:  '#EF4444',
  warning: '#F59E0B',

  // Bordes
  border:      '#E4E4EE',
  borderLight: '#CDCDD8',
};

// ── Paleta por defecto (dark) para compatibilidad con imports directos ───────
export const Palette = DarkPalette;

// ── Colors (expo-router) ─────────────────────────────────────────────────────
export const Colors = {
  light: {
    text:            LightPalette.textPrimary,
    background:      LightPalette.bgDeep,
    tint:            LightPalette.primary,
    icon:            LightPalette.textSecondary,
    tabIconDefault:  LightPalette.textMuted,
    tabIconSelected: LightPalette.primary,
  },
  dark: {
    text:            DarkPalette.textPrimary,
    background:      DarkPalette.bgDeep,
    tint:            DarkPalette.primary,
    icon:            DarkPalette.textSecondary,
    tabIconDefault:  DarkPalette.textMuted,
    tabIconSelected: DarkPalette.primary,
  },
};

// ── Tipografía ───────────────────────────────────────────────────────────────
export const Fonts = Platform.select({
  ios:     { sans: 'system-ui', mono: 'ui-monospace' },
  default: { sans: 'normal',    mono: 'monospace' },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});

// ── Espaciado / Radios / Sombras ─────────────────────────────────────────────
export const Spacing  = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const Radius   = { sm: 6, md: 12, lg: 18, xl: 24, full: 9999 };
export const Shadows  = {
  card: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.45, shadowRadius: 8, elevation: 5 },
  tabBar: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 20 },
};
