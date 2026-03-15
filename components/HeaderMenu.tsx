import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette } from '@/constants/theme';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderMenuProps {
  title: string;
}

export default function HeaderMenu({ title }: HeaderMenuProps) {
  return (
    <View style={s.header}>
      <View>
        <Text style={s.greeting}>Bienvenido 👋</Text>
        <Text style={s.title}>{title}</Text>
      </View>
      <View style={s.actions}>
        <Link href="/exercises" asChild>
          <TouchableOpacity style={s.iconBtn}>
            <IconSymbol size={22} name="list.bullet" color={Palette.primary} />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 10,
  },
  greeting: { fontSize: 13, color: Palette.textSecondary, letterSpacing: 0.4, marginBottom: 2 },
  title:    { fontSize: 30, fontWeight: '800', color: Palette.textPrimary, letterSpacing: -0.5 },
  actions:  { flexDirection: 'row', gap: 10 },
  iconBtn:  {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: Palette.bgElevated, borderWidth: 1, borderColor: Palette.border,
    justifyContent: 'center', alignItems: 'center',
  },
});
