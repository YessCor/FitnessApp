import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Palette } from '@/constants/theme';

interface ExerciseCardProps {
  name: string;
  muscleGroup: string;
}

export default function ExerciseCard({ name, muscleGroup }: ExerciseCardProps) {
  return (
    <View style={s.card}>
      <View style={s.iconWrap}>
        <Text style={s.icon}>🏋️</Text>
      </View>
      <View style={s.content}>
        <Text style={s.name}>{name}</Text>
        <View style={s.badge}>
          <Text style={s.badgeText}>{muscleGroup}</Text>
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
    backgroundColor: Palette.primaryGlow,
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  icon:      { fontSize: 22 },
  content:   { flex: 1 },
  name:      { color: Palette.textPrimary,   fontSize: 13, fontWeight: '700', marginBottom: 6, lineHeight: 17 },
  badge:     { backgroundColor: Palette.primaryGlow, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start' },
  badgeText: { color: Palette.primary, fontSize: 10, fontWeight: '700' },
});
