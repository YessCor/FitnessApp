import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Palette } from '@/constants/theme';

const API_BASE = 'http://10.0.2.2:3000';

interface EjercicioPlan {
  id: number; series: number; repeticiones: number;
  ejercicio: { id: number; nombre: string; grupoMuscular: string; descripcion: string | null; };
}
interface PlanEntrenamiento {
  id: number; nombre: string; nivel: string;
  duracionSemanas: number; ejerciciosPlan: EjercicioPlan[];
}

const DEFAULT_PLAN: PlanEntrenamiento = {
  id: 1, nombre: 'Plan Principiante', nivel: 'Básico', duracionSemanas: 4,
  ejerciciosPlan: [
    { id: 1, series: 3, repeticiones: 12, ejercicio: { id: 1, nombre: 'Press de Banca', grupoMuscular: 'Pecho',    descripcion: 'Ejercicio para pectorales' } },
    { id: 2, series: 3, repeticiones: 15, ejercicio: { id: 2, nombre: 'Sentadillas',    grupoMuscular: 'Piernas',  descripcion: 'Ejercicio para cuadriceps' } },
    { id: 3, series: 3, repeticiones: 10, ejercicio: { id: 3, nombre: 'Peso Muerto',    grupoMuscular: 'Espalda',  descripcion: 'Ejercicio para espalda' } },
    { id: 4, series: 4, repeticiones: 12, ejercicio: { id: 4, nombre: 'Press Militar',  grupoMuscular: 'Hombros',  descripcion: 'Ejercicio para hombros' } },
  ],
};

const LEVEL_COLORS: Record<string, string> = {
  'Básico':  Palette.secondary,
  'Medio':   Palette.warning,
  'Experto': Palette.danger,
};

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams();
  const [plan,    setPlan]    = useState<PlanEntrenamiento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPlan(); }, [id]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const planId = id as string;
      const res    = await fetch(`${API_BASE}/planes/${planId}`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const d = await res.json();
        setPlan(d.ejerciciosPlan ? d : { ...DEFAULT_PLAN, id: parseInt(planId), nombre: d.nombre ?? DEFAULT_PLAN.nombre });
      } else { setPlan(DEFAULT_PLAN); }
    } catch { setPlan(DEFAULT_PLAN); }
    finally  { setLoading(false); }
  };

  if (loading) return (
    <View style={s.loadingScreen}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bgDeep} />
      <ActivityIndicator size="large" color={Palette.primary} />
    </View>
  );

  if (!plan) return (
    <View style={s.container}>
      <Text style={s.errorText}>Plan no encontrado</Text>
    </View>
  );

  const levelColor = LEVEL_COLORS[plan.nivel] ?? Palette.accent;

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bgDeep} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <Link href="/" asChild>
            <TouchableOpacity style={s.backBtn}><Text style={s.backArrow}>←</Text></TouchableOpacity>
          </Link>
          <Text style={s.headerTitle}>Detalle del Plan</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Plan hero card */}
        <View style={[s.heroCard, { borderColor: levelColor }]}>
          <View style={[s.heroAccent, { backgroundColor: levelColor }]} />
          <Text style={s.planName}>{plan.nombre}</Text>
          <View style={s.planMeta}>
            <View style={[s.levelBadge, { backgroundColor: levelColor + '33' }]}>
              <Text style={[s.levelText, { color: levelColor }]}>{plan.nivel}</Text>
            </View>
            <Text style={s.duration}>⏱ {plan.duracionSemanas} semanas</Text>
          </View>
          <View style={s.planStats}>
            <View style={s.planStatItem}>
              <Text style={s.planStatValue}>{plan.ejerciciosPlan.length}</Text>
              <Text style={s.planStatLabel}>Ejercicios</Text>
            </View>
            <View style={s.planStatDivider} />
            <View style={s.planStatItem}>
              <Text style={s.planStatValue}>{plan.ejerciciosPlan.reduce((a, e) => a + e.series, 0)}</Text>
              <Text style={s.planStatLabel}>Series Totales</Text>
            </View>
            <View style={s.planStatDivider} />
            <View style={s.planStatItem}>
              <Text style={s.planStatValue}>{plan.duracionSemanas}</Text>
              <Text style={s.planStatLabel}>Semanas</Text>
            </View>
          </View>
        </View>

        {/* Ejercicios */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Ejercicios del Plan</Text>
          {plan.ejerciciosPlan.map((ep, index) => (
            <View key={ep.id} style={s.exCard}>
              <View style={[s.exNumber, { backgroundColor: levelColor + '22' }]}>
                <Text style={[s.exNumberText, { color: levelColor }]}>{index + 1}</Text>
              </View>
              <View style={s.exInfo}>
                <Text style={s.exName}>{ep.ejercicio.nombre}</Text>
                <Text style={s.exMuscle}>{ep.ejercicio.grupoMuscular}</Text>
                {ep.ejercicio.descripcion && (
                  <Text style={s.exDesc}>{ep.ejercicio.descripcion}</Text>
                )}
              </View>
              <View style={s.setsReps}>
                <View style={s.srItem}>
                  <Text style={[s.srValue, { color: Palette.primary }]}>{ep.series}</Text>
                  <Text style={s.srLabel}>series</Text>
                </View>
                <Text style={s.srX}>×</Text>
                <View style={s.srItem}>
                  <Text style={[s.srValue, { color: Palette.secondary }]}>{ep.repeticiones}</Text>
                  <Text style={s.srLabel}>reps</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Palette.bgDeep },
  loadingScreen:{ flex: 1, backgroundColor: Palette.bgDeep, justifyContent: 'center', alignItems: 'center' },
  errorText:    { color: Palette.textPrimary, fontSize: 16, textAlign: 'center', marginTop: 100 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: Palette.bgElevated, borderWidth: 1, borderColor: Palette.border,
    justifyContent: 'center', alignItems: 'center',
  },
  backArrow:   { color: Palette.textPrimary, fontSize: 20 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Palette.textPrimary },

  heroCard: {
    marginHorizontal: 20, backgroundColor: Palette.bgCard,
    borderRadius: 22, padding: 20, marginBottom: 28,
    borderWidth: 1.5, overflow: 'hidden',
  },
  heroAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, borderTopLeftRadius: 22, borderBottomLeftRadius: 22 },
  planName:   { fontSize: 24, fontWeight: '800', color: Palette.textPrimary, marginBottom: 12, paddingLeft: 8 },
  planMeta:   { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20, paddingLeft: 8 },
  levelBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  levelText:  { fontSize: 12, fontWeight: '700' },
  duration:   { color: Palette.textSecondary, fontSize: 13 },

  planStats:       { flexDirection: 'row', backgroundColor: Palette.bgElevated, borderRadius: 14, padding: 14 },
  planStatItem:    { flex: 1, alignItems: 'center' },
  planStatValue:   { color: Palette.textPrimary, fontSize: 22, fontWeight: '800', marginBottom: 2 },
  planStatLabel:   { color: Palette.textSecondary, fontSize: 10 },
  planStatDivider: { width: 1, backgroundColor: Palette.border, marginHorizontal: 8 },

  section:      { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Palette.textPrimary, marginBottom: 14 },

  exCard: {
    backgroundColor: Palette.bgCard, borderRadius: 18, padding: 16, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Palette.border,
  },
  exNumber:     { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  exNumberText: { fontWeight: '800', fontSize: 16 },
  exInfo:       { flex: 1 },
  exName:       { color: Palette.textPrimary,   fontSize: 15, fontWeight: '700', marginBottom: 3 },
  exMuscle:     { color: Palette.primary,        fontSize: 11, fontWeight: '600', marginBottom: 3 },
  exDesc:       { color: Palette.textSecondary,  fontSize: 11 },
  setsReps:     { flexDirection: 'row', alignItems: 'center', gap: 6 },
  srItem:       { alignItems: 'center', backgroundColor: Palette.bgElevated, borderRadius: 10, padding: 10, minWidth: 44 },
  srValue:      { fontSize: 18, fontWeight: '800' },
  srLabel:      { color: Palette.textMuted, fontSize: 9 },
  srX:          { color: Palette.textMuted, fontSize: 14, fontWeight: '700' },
});
