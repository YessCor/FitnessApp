/**
 * Fitness App - Tema rediseñado
 * Paleta: Naranja energético + fondo oscuro profundo + acentos cyan
 */

import { Platform } from 'react-native';

// ── Colores principales ─────────────────────────────────────────────────────
export const Palette = {
  // Fondos
  bgDeep:     '#0B0D12',
  bgCard:     '#13161E',
  bgElevated: '#1C2030',

  // Acento primario — naranja energético
  primary:        '#FF6B2B',
  primaryLight:   '#FF8C5A',
  primaryDark:    '#CC4F18',
  primaryGlow:    'rgba(255,107,43,0.18)',

  // Acento secundario — cyan/turquesa
  secondary:      '#00D4AA',
  secondaryLight: '#33DEBB',
  secondaryGlow:  'rgba(0,212,170,0.15)',

  // Acento terciario — violeta suave
  accent:     '#7C6FFF',
  accentGlow: 'rgba(124,111,255,0.15)',

  // Texto
  textPrimary:   '#F0F2F8',
  textSecondary: '#8A90A8',
  textMuted:     '#4E5368',

  // Alertas
  success: '#22D98B',
  danger:  '#FF4D6A',
  warning: '#FFB923',

  // Bordes
  border:      '#1F2338',
  borderLight: '#2A2F4A',
};

// ── Colors (mantiene compatibilidad con expo-router) ────────────────────────
const tintColorLight = Palette.primary;
const tintColorDark  = Palette.primary;

export const Colors = {
  light: {
    text:            Palette.textPrimary,
    background:      Palette.bgDeep,
    tint:            tintColorLight,
    icon:            Palette.textSecondary,
    tabIconDefault:  Palette.textSecondary,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text:            Palette.textPrimary,
    background:      Palette.bgDeep,
    tint:            tintColorDark,
    icon:            Palette.textSecondary,
    tabIconDefault:  Palette.textSecondary,
    tabIconSelected: tintColorDark,
  },
};

// ── Tipografía ───────────────────────────────────────────────────────────────
export const Fonts = Platform.select({
  ios: {
    sans:    'system-ui',
    serif:   'ui-serif',
    rounded: 'ui-rounded',
    mono:    'ui-monospace',
  },
  default: {
    sans:    'normal',
    serif:   'serif',
    rounded: 'normal',
    mono:    'monospace',
  },
  web: {
    sans:    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif:   "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono:    "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// ── Espaciado y radios ───────────────────────────────────────────────────────
export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const Radius = {
  sm:   8,
  md:   14,
  lg:   20,
  xl:   28,
  full: 9999,
};

// ── Sombras ──────────────────────────────────────────────────────────────────
export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
};
