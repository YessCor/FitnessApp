import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Palette } from '@/constants/theme';

interface MealCardProps {
  name: string;
  calories: number;
}

export default function MealCard({ name, calories }: MealCardProps) {
  return (
    <View style={s.card}>
      <View style={s.iconWrap}>
        <Text style={s.icon}>🍽️</Text>
      </View>
      <View style={s.content}>
        <Text style={s.name}>{name}</Text>
        <View style={s.calRow}>
          <Text style={s.calories}>{calories}</Text>
          <Text style={s.calLabel}> kcal</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: Palette.bgCard,
    borderRadius: 18, padding: 14, marginRight: 12, width: 148,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Palette.border,
  },
  iconWrap: {
    width: 46, height: 46, borderRadius: 13,
    backgroundColor: Palette.secondaryGlow,
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  icon:     { fontSize: 22 },
  content:  { flex: 1 },
  name:     { color: Palette.textPrimary,   fontSize: 13, fontWeight: '700', marginBottom: 5, lineHeight: 17 },
  calRow:   { flexDirection: 'row', alignItems: 'baseline' },
  calories: { color: Palette.secondary, fontSize: 15, fontWeight: '800' },
  calLabel: { color: Palette.textSecondary, fontSize: 10 },
});
