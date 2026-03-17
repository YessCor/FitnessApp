import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette } from '@/constants/theme';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const API_BASE = 'http://10.9.220.193:3000';

interface Exercise {
  id: number;
  nombre: string;
  grupo_muscular: string;
  descripcion?: string;
}

const DEFAULT_EXERCISES: Exercise[] = [
  { id: 1, nombre: 'Press de Banca',  grupo_muscular: 'Pecho',    descripcion: 'Ejercicio para pectorales' },
  { id: 2, nombre: 'Sentadillas',     grupo_muscular: 'Piernas',  descripcion: 'Cuadriceps y glúteos' },
  { id: 3, nombre: 'Peso Muerto',     grupo_muscular: 'Espalda',  descripcion: 'Espalda baja' },
  { id: 4, nombre: 'Press Militar',   grupo_muscular: 'Hombros',  descripcion: 'Hombros' },
  { id: 5, nombre: 'Dominadas',       grupo_muscular: 'Espalda',  descripcion: 'Espalda y bíceps' },
  { id: 6, nombre: 'Curl de Bíceps',  grupo_muscular: 'Brazos',   descripcion: 'Bíceps' },
  { id: 7, nombre: 'Extensiones',     grupo_muscular: 'Tríceps',  descripcion: 'Tríceps' },
  { id: 8, nombre: 'Crunches',        grupo_muscular: 'Abdomen',  descripcion: 'Abdomen' },
];

type MuscleIconName = 'dumbbell.fill' | 'figure.run' | 'figure.strengthtraining.traditional' | 'figure.walk' | 'figure.core.training' | 'bolt.fill';

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
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bgDeep} />

      {/* Header */}
      <View style={s.header}>
        <Link href="/" asChild>
          <TouchableOpacity style={s.backBtn}>
            <IconSymbol size={18} name="arrow.left" color={Palette.textPrimary} />
          </TouchableOpacity>
        </Link>
        <Text style={s.title}>EJERCICIOS</Text>
        <View style={{ width: 40 }} />
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

      {/* Divider */}
      <View style={s.divider} />

      {loading ? (
        <View style={s.loader}>
          <ActivityIndicator size="large" color={Palette.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
          {filtered.map((ex, i) => (
            <View key={ex.id} style={[s.row, i < filtered.length - 1 && s.rowBorder]}>
              <View style={s.iconWrap}>
                <IconSymbol
                  size={18}
                  name={MUSCLE_ICONS[ex.grupo_muscular] ?? MUSCLE_ICONS.default}
                  color={Palette.textSecondary}
                />
              </View>
              <View style={s.info}>
                <Text style={s.name}>{ex.nombre}</Text>
                {ex.descripcion && <Text style={s.desc}>{ex.descripcion}</Text>}
              </View>
              <Text style={s.muscle}>{ex.grupo_muscular.toUpperCase()}</Text>
            </View>
          ))}
          <View style={{ height: 80 }} />
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
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: Palette.bgElevated, borderWidth: 0.5, borderColor: Palette.border,
    justifyContent: 'center', alignItems: 'center',
  },
  title: {
    fontSize: 12, fontWeight: '700', color: Palette.textPrimary, letterSpacing: 2,
  },

  filterBar:    { maxHeight: 48, flexGrow: 0 },
  filterContent: { paddingHorizontal: 20, gap: 6, alignItems: 'center' },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 0.5, borderColor: Palette.border,
    marginRight: 6,
  },
  chipActive:     { backgroundColor: Palette.bgElevated, borderColor: Palette.borderLight },
  chipText:       { color: Palette.textMuted, fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: Palette.textPrimary },

  divider: { height: 0.5, backgroundColor: Palette.border, marginHorizontal: 20, marginTop: 14, marginBottom: 4 },

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  list: { paddingHorizontal: 20, paddingTop: 4 },

  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 16,
  },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: Palette.border },
  iconWrap: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: Palette.bgElevated,
    borderWidth: 0.5, borderColor: Palette.border,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  info:   { flex: 1 },
  name:   { color: Palette.textPrimary, fontSize: 14, fontWeight: '600', marginBottom: 2 },
  desc:   { color: Palette.textMuted, fontSize: 11 },
  muscle: { color: Palette.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
});
