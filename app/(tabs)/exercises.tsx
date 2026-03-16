import React, { useState, useEffect } from 'react';
import {
  ScrollView, View, Text, StyleSheet,
  ActivityIndicator, TouchableOpacity, StatusBar,
} from 'react-native';
import { useAppTheme } from '@/hooks/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

const API_BASE = 'http://10.0.2.2:3000';

interface Exercise {
  id: number;
  nombre: string;
  grupo_muscular: string;
  descripcion?: string;
}

const DEFAULT_EXERCISES: Exercise[] = [
  { id: 1, nombre: 'Press de Banca',  grupo_muscular: 'Pecho',   descripcion: 'Ejercicio para pectorales' },
  { id: 2, nombre: 'Sentadillas',     grupo_muscular: 'Piernas', descripcion: 'Cuadriceps y glúteos' },
  { id: 3, nombre: 'Peso Muerto',     grupo_muscular: 'Espalda', descripcion: 'Espalda baja' },
  { id: 4, nombre: 'Press Militar',   grupo_muscular: 'Hombros', descripcion: 'Hombros' },
  { id: 5, nombre: 'Dominadas',       grupo_muscular: 'Espalda', descripcion: 'Espalda y bíceps' },
  { id: 6, nombre: 'Curl de Bíceps',  grupo_muscular: 'Brazos',  descripcion: 'Bíceps' },
  { id: 7, nombre: 'Extensiones',     grupo_muscular: 'Tríceps', descripcion: 'Tríceps' },
  { id: 8, nombre: 'Crunches',        grupo_muscular: 'Abdomen', descripcion: 'Abdomen' },
];

type MuscleIconName = 'dumbbell.fill' | 'figure.run' | 'figure.strengthtraining.traditional' | 'figure.core.training' | 'bolt.fill';

const MUSCLE_ICONS: Record<string, MuscleIconName> = {
  Pecho:   'dumbbell.fill',
  Piernas: 'figure.run',
  Espalda: 'figure.strengthtraining.traditional',
  Hombros: 'bolt.fill',
  Brazos:  'dumbbell.fill',
  Tríceps: 'dumbbell.fill',
  Abdomen: 'figure.core.training',
  default: 'dumbbell.fill',
};

const muscleGroups = ['Pecho', 'Piernas', 'Espalda', 'Hombros', 'Brazos', 'Tríceps', 'Abdomen'];

export default function ExercisesScreen() {
  const { palette, isDark } = useAppTheme();
  const [exercises,      setExercises]      = useState<Exercise[]>(DEFAULT_EXERCISES);
  const [loading,        setLoading]        = useState(false);
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
    <View style={{ flex: 1, backgroundColor: palette.bgDeep }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={palette.bgDeep} />

      {/* Header */}
      <View style={[s.header, { borderBottomColor: palette.border, borderBottomWidth: 0.5 }]}>
        <Text style={[s.title, { color: palette.textPrimary }]}>Ejercicios</Text>
        <Text style={[s.subtitle, { color: palette.textSecondary }]}>{exercises.length} disponibles</Text>
      </View>

      {/* Filtros */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 52, flexGrow: 0 }}
        contentContainerStyle={[s.filterContent, { paddingHorizontal: 20 }]}
      >
        {['Todos', ...muscleGroups].map(m => {
          const isActive = m === 'Todos' ? !selectedMuscle : selectedMuscle === m;
          return (
            <TouchableOpacity
              key={m}
              style={[
                s.chip,
                { borderColor: isActive ? palette.primary : palette.border,
                  backgroundColor: isActive ? palette.primaryGlow : palette.bgCard },
              ]}
              onPress={() => setSelectedMuscle(m === 'Todos' ? null : m)}
            >
              <Text style={[s.chipText, { color: isActive ? palette.primary : palette.textSecondary }]}>
                {m}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={[s.divider, { backgroundColor: palette.border }]} />

      {loading ? (
        <View style={s.loader}><ActivityIndicator size="large" color={palette.primary} /></View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4 }} showsVerticalScrollIndicator={false}>
          {filtered.map((ex, i) => (
            <View
              key={ex.id}
              style={[
                s.row,
                i < filtered.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: palette.border },
              ]}
            >
              <View style={[s.iconWrap, { backgroundColor: palette.bgElevated, borderColor: palette.border }]}>
                <IconSymbol
                  size={18}
                  name={MUSCLE_ICONS[ex.grupo_muscular] ?? MUSCLE_ICONS.default}
                  color={palette.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.exName, { color: palette.textPrimary }]}>{ex.nombre}</Text>
                {ex.descripcion && <Text style={[s.exDesc, { color: palette.textMuted }]}>{ex.descripcion}</Text>}
              </View>
              <View style={[s.musclePill, { backgroundColor: palette.primaryGlow }]}>
                <Text style={[s.muscleText, { color: palette.primary }]}>{ex.grupo_muscular}</Text>
              </View>
            </View>
          ))}
          <View style={{ height: 120 }} />
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20,
  },
  title:    { fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 4 },
  filterContent: { gap: 8, alignItems: 'center', paddingVertical: 10 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1, marginRight: 6,
  },
  chipText: { fontSize: 13, fontWeight: '600' },
  divider:  { height: 0.5, marginHorizontal: 20, marginBottom: 4 },
  loader:   { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, gap: 12,
  },
  iconWrap: {
    width: 42, height: 42, borderRadius: 12,
    borderWidth: 0.5,
    justifyContent: 'center', alignItems: 'center',
  },
  exName:    { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  exDesc:    { fontSize: 11 },
  musclePill:{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  muscleText:{ fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
});
