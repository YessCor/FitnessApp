import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Palette } from '@/constants/theme';

interface PlanCardProps {
  name: string;
  level: string;
  durationWeeks: number;
}

const LEVEL_COLORS: Record<string, string> = {
  'Básico':  Palette.secondary,
  'Medio':   Palette.warning,
  'Experto': Palette.danger,
};

export default function PlanCard({ name, level, durationWeeks }: PlanCardProps) {
  const levelColor = LEVEL_COLORS[level] ?? Palette.accent;

  return (
    <View style={s.card}>
      <View style={[s.levelDot, { backgroundColor: levelColor }]} />
      <Text style={s.name}>{name}</Text>
      <View style={s.footer}>
        <View style={[s.badge, { backgroundColor: levelColor + '33' }]}>
          <Text style={[s.badgeText, { color: levelColor }]}>{level}</Text>
        </View>
        <Text style={s.duration}>{durationWeeks} sem</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: Palette.bgCard,
    borderRadius: 18, padding: 16, marginRight: 12, width: 158,
    borderWidth: 1, borderColor: Palette.border,
  },
  levelDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 10 },
  name:     { color: Palette.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 14, lineHeight: 20 },
  footer:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge:    { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText:{ fontSize: 10, fontWeight: '700' },
  duration: { color: Palette.textMuted, fontSize: 11 },
});
