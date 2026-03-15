import React, { useState, useEffect } from 'react';
import {
  ScrollView, View, Text, StyleSheet,
  ActivityIndicator, TouchableOpacity, StatusBar,
} from 'react-native';
import { Link } from 'expo-router';
import { Palette } from '@/constants/theme';

const API_BASE = 'http://10.0.2.2:3000';

interface Exercise {
  id: number;
  nombre: string;
  grupo_muscular: string;
  descripcion?: string;
}

const DEFAULT_EXERCISES: Exercise[] = [
  { id: 1, nombre: 'Press de Banca',  grupo_muscular: 'Pecho',    descripcion: 'Ejercicio para pectorales' },
  { id: 2, nombre: 'Sentadillas',     grupo_muscular: 'Piernas',  descripcion: 'Ejercicio para cuadriceps y gluteos' },
  { id: 3, nombre: 'Peso Muerto',     grupo_muscular: 'Espalda',  descripcion: 'Ejercicio para espalda baja' },
  { id: 4, nombre: 'Press Militar',   grupo_muscular: 'Hombros',  descripcion: 'Ejercicio para hombros' },
  { id: 5, nombre: 'Dominadas',       grupo_muscular: 'Espalda',  descripcion: 'Ejercicio para espalda y biceps' },
  { id: 6, nombre: 'Curl de Bíceps',  grupo_muscular: 'Brazos',   descripcion: 'Ejercicio para biceps' },
  { id: 7, nombre: 'Extensiones',     grupo_muscular: 'Tríceps',  descripcion: 'Ejercicio para triceps' },
  { id: 8, nombre: 'Crunches',        grupo_muscular: 'Abdomen',  descripcion: 'Ejercicio para abdomen' },
];

const MUSCLE_ICONS: Record<string, string> = {
  Pecho: '🫀', Piernas: '🦵', Espalda: '🔙', Hombros: '💪',
  Brazos: '💪', Tríceps: '💪', Abdomen: '🏃', default: '🏋️',
};

const muscleGroups = ['Pecho', 'Piernas', 'Espalda', 'Hombros', 'Brazos', 'Tríceps', 'Abdomen'];

export default function ExercisesScreen() {
  const [exercises,     setExercises]     = useState<Exercise[]>(DEFAULT_EXERCISES);
  const [loading,       setLoading]       = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  useEffect(() => { fetchExercises(); }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/ejercicios`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) { const d = await res.json(); if (d.length) setExercises(d); }
    } catch {}
    finally { setLoading(false); }
  };

  const filtered = selectedMuscle
    ? exercises.filter(e => e.grupo_muscular === selectedMuscle)
    : exercises;

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bgDeep} />

      {/* Header */}
      <View style={s.header}>
        <Link href="/" asChild>
          <TouchableOpacity style={s.backBtn}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
        </Link>
        <Text style={s.title}>Ejercicios</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Filtros */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={s.filterBar} contentContainerStyle={s.filterContent}
      >
        <TouchableOpacity
          style={[s.chip, !selectedMuscle && s.chipActive]}
          onPress={() => setSelectedMuscle(null)}
        >
          <Text style={[s.chipText, !selectedMuscle && s.chipTextActive]}>Todos</Text>
        </TouchableOpacity>
        {muscleGroups.map(m => (
          <TouchableOpacity
            key={m}
            style={[s.chip, selectedMuscle === m && s.chipActive]}
            onPress={() => setSelectedMuscle(m)}
          >
            <Text style={[s.chipText, selectedMuscle === m && s.chipTextActive]}>{m}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={s.loader}>
          <ActivityIndicator size="large" color={Palette.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.grid}>
          {filtered.map((ex) => (
            <View key={ex.id} style={s.card}>
              <View style={s.iconWrap}>
                <Text style={s.iconText}>{MUSCLE_ICONS[ex.grupo_muscular] ?? MUSCLE_ICONS.default}</Text>
              </View>
              <View style={s.info}>
                <Text style={s.name}>{ex.nombre}</Text>
                <View style={s.badge}>
                  <Text style={s.badgeText}>{ex.grupo_muscular}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.bgDeep },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: Palette.bgElevated, borderWidth: 1, borderColor: Palette.border,
    justifyContent: 'center', alignItems: 'center',
  },
  backArrow: { color: Palette.textPrimary, fontSize: 20 },
  title:     { fontSize: 22, fontWeight: '800', color: Palette.textPrimary },

  filterBar:    { maxHeight: 52 },
  filterContent: { paddingHorizontal: 20, gap: 8, flexDirection: 'row' },
  chip: {
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12,
    backgroundColor: Palette.bgElevated, marginRight: 8,
    borderWidth: 1, borderColor: Palette.border,
  },
  chipActive:     { backgroundColor: Palette.primary, borderColor: Palette.primary },
  chipText:       { color: Palette.textSecondary, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#fff' },

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  grid: { padding: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  card: {
    backgroundColor: Palette.bgCard, borderRadius: 18, padding: 14,
    width: '47%', flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Palette.border,
  },
  iconWrap: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: Palette.primaryGlow,
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  iconText: { fontSize: 22 },
  info:     { flex: 1 },
  name:     { color: Palette.textPrimary, fontSize: 13, fontWeight: '700', marginBottom: 6, lineHeight: 17 },
  badge:    { backgroundColor: Palette.primaryGlow, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start' },
  badgeText:{ color: Palette.primary, fontSize: 10, fontWeight: '700' },
});
