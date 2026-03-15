import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Link } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette } from '@/constants/theme';

const API_BASE = 'http://10.0.2.2:3000';

interface Plan {
  id: number;
  nombre: string;
  nivel: string;
  duracion_semanas: number;
}

interface Exercise {
  id: number;
  nombre: string;
  grupo_muscular: string;
}

interface Meal {
  id: number;
  nombre: string;
  calorias: number;
}

const DEFAULT_PLANS: Plan[] = [
  { id: 1, nombre: 'Plan Principiante', nivel: 'Básico', duracion_semanas: 4 },
  { id: 2, nombre: 'Plan Intermedio',   nivel: 'Medio',  duracion_semanas: 8 },
  { id: 3, nombre: 'Plan Avanzado',     nivel: 'Experto', duracion_semanas: 12 },
];

const DEFAULT_EXERCISES: Exercise[] = [
  { id: 1, nombre: 'Press de Banca', grupo_muscular: 'Pecho' },
  { id: 2, nombre: 'Sentadillas',    grupo_muscular: 'Piernas' },
  { id: 3, nombre: 'Peso Muerto',    grupo_muscular: 'Espalda' },
];

const DEFAULT_MEALS: Meal[] = [
  { id: 1, nombre: 'Desayuno Proteico',    calorias: 450 },
  { id: 2, nombre: 'Almuerzo Balanceado',  calorias: 650 },
  { id: 3, nombre: 'Cena Ligera',          calorias: 350 },
];

const RECOMMENDATIONS = [
  { id: 1, title: 'Hidratación',   description: 'Bebe al menos 2 litros de agua al día',        icon: '💧', color: Palette.secondary },
  { id: 2, title: 'Descanso',      description: 'Duerme entre 7-8 horas para recuperarte',      icon: '😴', color: Palette.accent },
  { id: 3, title: 'Calentamiento', description: 'Siempre calienta antes de entrenar',           icon: '🔥', color: Palette.primary },
];

const LEVEL_COLORS: Record<string, string> = {
  'Básico':  Palette.secondary,
  'Medio':   Palette.warning,
  'Experto': Palette.danger,
};

export default function HomeScreen() {
  const [plans,     setPlans]     = useState<Plan[]>(DEFAULT_PLANS);
  const [exercises, setExercises] = useState<Exercise[]>(DEFAULT_EXERCISES);
  const [meals,     setMeals]     = useState<Meal[]>(DEFAULT_MEALS);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const tryFetch = async (url: string) => {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) throw new Error('bad response');
      return res.json();
    };
    try { const d = await tryFetch(`${API_BASE}/planes`);    if (d.length) setPlans(d);     } catch {}
    try { const d = await tryFetch(`${API_BASE}/ejercicios`); if (d.length) setExercises(d);} catch {}
    try { const d = await tryFetch(`${API_BASE}/comidas`);   if (d.length) setMeals(d);     } catch {}
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bgDeep} />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Bienvenido 👋</Text>
            <Text style={s.appTitle}>FitnessApp</Text>
          </View>
          <Link href="/exercises" asChild>
            <TouchableOpacity style={s.headerBtn}>
              <IconSymbol size={22} name="list.bullet" color={Palette.primary} />
            </TouchableOpacity>
          </Link>
        </View>

        {/* ── Hero Banner ── */}
        <View style={s.heroBanner}>
          <View style={s.heroAccentLine} />
          <Text style={s.heroTitle}>¡Comienza tu{'\n'}transformación! 💪</Text>
          <Text style={s.heroSub}>La consistencia es la clave del éxito</Text>
        </View>

        {/* ── Stats ── */}
        <View style={s.statsRow}>
          {[
            { value: '3',    label: 'Racha',     color: Palette.primary },
            { value: '12',   label: 'Ejercicios', color: Palette.secondary },
            { value: '1,450', label: 'Kcal Hoy',  color: Palette.accent },
          ].map((stat) => (
            <View key={stat.label} style={s.statCard}>
              <Text style={[s.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Nav rápida ── */}
        <View style={s.navRow}>
          <Link href="/nutrition" asChild>
            <TouchableOpacity style={[s.navBtn, { borderColor: Palette.secondary }]}>
              <Text style={s.navIcon}>🥗</Text>
              <Text style={[s.navText, { color: Palette.secondary }]}>Nutrición</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/progress" asChild>
            <TouchableOpacity style={[s.navBtn, { borderColor: Palette.primary }]}>
              <Text style={s.navIcon}>📊</Text>
              <Text style={[s.navText, { color: Palette.primary }]}>Progreso</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* ── Recomendaciones ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Recomendaciones del Día</Text>
          {RECOMMENDATIONS.map((rec) => (
            <View key={rec.id} style={s.recCard}>
              <View style={[s.recIconWrap, { backgroundColor: rec.color + '22' }]}>
                <Text style={s.recIconText}>{rec.icon}</Text>
              </View>
              <View style={s.recContent}>
                <Text style={s.recTitle}>{rec.title}</Text>
                <Text style={s.recDesc}>{rec.description}</Text>
              </View>
              <View style={[s.recAccent, { backgroundColor: rec.color }]} />
            </View>
          ))}
        </View>

        {/* ── Planes de Entrenamiento ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Planes de Entrenamiento</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.hScroll}>
            {plans.map((plan) => (
              <Link key={plan.id} href={`/plan/${plan.id}`} asChild>
                <TouchableOpacity style={s.planCard}>
                  <View style={[s.planLevelDot, { backgroundColor: LEVEL_COLORS[plan.nivel] ?? Palette.accent }]} />
                  <Text style={s.planName}>{plan.nombre}</Text>
                  <View style={s.planFooter}>
                    <View style={[s.planBadge, { backgroundColor: (LEVEL_COLORS[plan.nivel] ?? Palette.accent) + '33' }]}>
                      <Text style={[s.planBadgeText, { color: LEVEL_COLORS[plan.nivel] ?? Palette.accent }]}>
                        {plan.nivel}
                      </Text>
                    </View>
                    <Text style={s.planDur}>{plan.duracion_semanas} sem</Text>
                  </View>
                </TouchableOpacity>
              </Link>
            ))}
          </ScrollView>
        </View>

        {/* ── Ejercicios Populares ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Ejercicios Populares</Text>
            <Link href="/exercises">
              <Text style={s.seeAll}>Ver todos →</Text>
            </Link>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.hScroll}>
            {exercises.map((ex) => (
              <View key={ex.id} style={s.exCard}>
                <View style={s.exIconWrap}>
                  <Text style={s.exIcon}>🏋️</Text>
                </View>
                <Text style={s.exName}>{ex.nombre}</Text>
                <View style={s.exMuscleBadge}>
                  <Text style={s.exMuscleText}>{ex.grupo_muscular}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── Nutrición ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Nutrición</Text>
            <Link href="/nutrition">
              <Text style={s.seeAll}>Ver todos →</Text>
            </Link>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.hScroll}>
            {meals.map((meal) => (
              <View key={meal.id} style={s.mealCard}>
                <View style={s.mealIconWrap}>
                  <Text style={s.mealIcon}>🍽️</Text>
                </View>
                <Text style={s.mealName}>{meal.nombre}</Text>
                <Text style={s.mealCal}>{meal.calorias} kcal</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Palette.bgDeep },
  scroll:      { flex: 1 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 8,
  },
  greeting:  { fontSize: 13, color: Palette.textSecondary, letterSpacing: 0.5, marginBottom: 2 },
  appTitle:  { fontSize: 30, fontWeight: '800', color: Palette.textPrimary, letterSpacing: -0.5 },
  headerBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: Palette.bgElevated,
    borderWidth: 1, borderColor: Palette.border,
    justifyContent: 'center', alignItems: 'center',
  },

  // Hero
  heroBanner: {
    marginHorizontal: 20, marginTop: 16, marginBottom: 24,
    backgroundColor: Palette.bgCard,
    borderRadius: 22, padding: 22,
    borderWidth: 1, borderColor: Palette.border,
    overflow: 'hidden',
  },
  heroAccentLine: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    width: 4, backgroundColor: Palette.primary, borderTopLeftRadius: 22, borderBottomLeftRadius: 22,
  },
  heroTitle: { fontSize: 24, fontWeight: '800', color: Palette.textPrimary, lineHeight: 32, marginBottom: 8, paddingLeft: 8 },
  heroSub:   { fontSize: 13, color: Palette.textSecondary, paddingLeft: 8 },

  // Stats
  statsRow: {
    flexDirection: 'row', marginHorizontal: 20,
    gap: 10, marginBottom: 20,
  },
  statCard: {
    flex: 1, backgroundColor: Palette.bgCard,
    borderRadius: 16, paddingVertical: 16, alignItems: 'center',
    borderWidth: 1, borderColor: Palette.border,
  },
  statValue: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 11, color: Palette.textSecondary, fontWeight: '500' },

  // Nav rápida
  navRow: { flexDirection: 'row', marginHorizontal: 20, gap: 12, marginBottom: 28 },
  navBtn: {
    flex: 1, backgroundColor: Palette.bgCard,
    borderRadius: 18, paddingVertical: 18, alignItems: 'center',
    borderWidth: 1.5,
  },
  navIcon: { fontSize: 28, marginBottom: 6 },
  navText: { fontSize: 13, fontWeight: '700', letterSpacing: 0.2 },

  // Section
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Palette.textPrimary, marginHorizontal: 20, marginBottom: 14, letterSpacing: 0.2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginBottom: 14 },
  seeAll: { color: Palette.primary, fontSize: 13, fontWeight: '600' },
  hScroll: { paddingHorizontal: 20 },

  // Recomendaciones
  recCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Palette.bgCard, marginHorizontal: 20, marginBottom: 10,
    borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: Palette.border,
    overflow: 'hidden',
  },
  recIconWrap: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  recIconText: { fontSize: 22 },
  recContent: { flex: 1 },
  recTitle:   { color: Palette.textPrimary,   fontSize: 14, fontWeight: '700', marginBottom: 3 },
  recDesc:    { color: Palette.textSecondary, fontSize: 12 },
  recAccent:  { position: 'absolute', right: 0, top: 0, bottom: 0, width: 3, borderTopRightRadius: 16, borderBottomRightRadius: 16 },

  // Plan cards
  planCard: {
    backgroundColor: Palette.bgCard, borderRadius: 18, padding: 16,
    marginRight: 12, width: 158,
    borderWidth: 1, borderColor: Palette.border,
  },
  planLevelDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 10 },
  planName:     { color: Palette.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 14, lineHeight: 20 },
  planFooter:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planBadge:    { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  planBadgeText:{ fontSize: 10, fontWeight: '700' },
  planDur:      { color: Palette.textMuted, fontSize: 11 },

  // Exercise cards
  exCard: {
    backgroundColor: Palette.bgCard, borderRadius: 18, padding: 16,
    marginRight: 12, width: 120, alignItems: 'center',
    borderWidth: 1, borderColor: Palette.border,
  },
  exIconWrap: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: Palette.primaryGlow,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  exIcon:        { fontSize: 26 },
  exName:        { color: Palette.textPrimary,   fontSize: 12, fontWeight: '700', textAlign: 'center', marginBottom: 8, lineHeight: 16 },
  exMuscleBadge: { backgroundColor: Palette.primaryGlow, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  exMuscleText:  { color: Palette.primary, fontSize: 10, fontWeight: '600' },

  // Meal cards
  mealCard: {
    backgroundColor: Palette.bgCard, borderRadius: 18, padding: 16,
    marginRight: 12, width: 120, alignItems: 'center',
    borderWidth: 1, borderColor: Palette.border,
  },
  mealIconWrap: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: Palette.secondaryGlow,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  mealIcon: { fontSize: 26 },
  mealName: { color: Palette.textPrimary,   fontSize: 12, fontWeight: '700', textAlign: 'center', marginBottom: 6, lineHeight: 16 },
  mealCal:  { color: Palette.secondary, fontSize: 12, fontWeight: '700' },
});
