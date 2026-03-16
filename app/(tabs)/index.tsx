import React, { useState, useEffect } from 'react';
import {
  ScrollView, View, Text, StyleSheet,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppTheme } from '@/hooks/ThemeContext';

const API_BASE = 'http://10.0.2.2:3000';

interface Plan     { id: number; nombre: string; nivel: string; duracion_semanas: number; }
interface Exercise { id: number; nombre: string; grupo_muscular: string; }
interface Meal     { id: number; nombre: string; calorias: number; }

const DEFAULT_PLANS: Plan[] = [
  { id: 1, nombre: 'Plan Principiante', nivel: 'Básico',  duracion_semanas: 4  },
  { id: 2, nombre: 'Plan Intermedio',   nivel: 'Medio',   duracion_semanas: 8  },
  { id: 3, nombre: 'Plan Avanzado',     nivel: 'Experto', duracion_semanas: 12 },
];

const DEFAULT_EXERCISES: Exercise[] = [
  { id: 1, nombre: 'Press de Banca', grupo_muscular: 'Pecho'   },
  { id: 2, nombre: 'Sentadillas',    grupo_muscular: 'Piernas' },
  { id: 3, nombre: 'Peso Muerto',    grupo_muscular: 'Espalda' },
];

const DEFAULT_MEALS: Meal[] = [
  { id: 1, nombre: 'Desayuno Proteico',   calorias: 450 },
  { id: 2, nombre: 'Almuerzo Balanceado', calorias: 650 },
  { id: 3, nombre: 'Cena Ligera',         calorias: 350 },
];

const TIPS: { id: number; label: string; value: string; icon: 'drop.fill' | 'moon.fill' | 'flame.fill' }[] = [
  { id: 1, label: 'Hidratación',   value: '2L / día', icon: 'drop.fill'  },
  { id: 2, label: 'Descanso',      value: '7–8 horas', icon: 'moon.fill'  },
  { id: 3, label: 'Calentamiento', value: 'Siempre',   icon: 'flame.fill' },
];

export default function HomeScreen() {
  const { palette, isDark, toggleTheme } = useAppTheme();
  const router = useRouter();
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

  const totalCal = DEFAULT_MEALS.reduce((s, m) => s + m.calorias, 0);

  return (
    <View style={[s.container, { backgroundColor: palette.bgDeep }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={palette.bgDeep} />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View>
            <Text style={[s.greeting, { color: palette.textMuted }]}>Bienvenido de vuelta</Text>
            <Text style={[s.appTitle, { color: palette.textPrimary }]}>FitnessApp</Text>
          </View>
          <TouchableOpacity
            style={[s.themeBtn, { backgroundColor: palette.bgElevated, borderColor: palette.border }]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <IconSymbol size={22} name={isDark ? 'sun.max.fill' : 'moon.fill'} color={palette.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* ── Hero Card ── */}
        <View style={[s.heroCard, { backgroundColor: palette.primary }]}>
          <View style={s.heroContent}>
            <Text style={s.heroEyebrow}>HOY</Text>
            <Text style={s.heroTitle}>¡A entrenar!</Text>
            <Text style={s.heroSub}>La consistencia es la clave del éxito</Text>
          </View>
          <View style={s.heroCircle}>
            <IconSymbol size={36} name="dumbbell.fill" color="rgba(255,255,255,0.25)" />
          </View>
        </View>

        {/* ── Stats ── */}
        <View style={s.statsRow}>
          {[
            { value: '3',             label: 'Días de racha',   accent: true  },
            { value: '12',            label: 'Ejercicios',      accent: false },
            { value: `${totalCal}`,   label: 'Kcal hoy',        accent: false },
          ].map((stat) => (
            <View
              key={stat.label}
              style={[
                s.statCard,
                {
                  backgroundColor: stat.accent ? palette.primaryGlow : palette.bgCard,
                  borderColor:     stat.accent ? palette.primary : palette.border,
                },
              ]}
            >
              <Text style={[s.statValue, { color: stat.accent ? palette.primary : palette.textPrimary }]}>
                {stat.value}
              </Text>
              <Text style={[s.statLabel, { color: palette.textMuted }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Tips ── */}
        <View style={[s.section, { borderColor: palette.border }]}>
          <Text style={[s.sectionTitle, { color: palette.textMuted }]}>RECOMENDACIONES</Text>
          {TIPS.map((tip, i) => (
            <View
              key={tip.id}
              style={[s.tipRow, i < TIPS.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: palette.border }]}
            >
              <View style={[s.tipIcon, { backgroundColor: palette.primaryGlow }]}>
                <IconSymbol size={16} name={tip.icon} color={palette.primary} />
              </View>
              <Text style={[s.tipLabel, { color: palette.textSecondary }]}>{tip.label}</Text>
              <Text style={[s.tipValue, { color: palette.textPrimary }]}>{tip.value}</Text>
            </View>
          ))}
        </View>

        {/* ── Planes ── */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: palette.textMuted }]}>PLANES DE ENTRENAMIENTO</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.hScroll}>
            {plans.map((plan, i) => {
              const isFeatured = i === 0;
              return (
                <TouchableOpacity
                  key={plan.id}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/plan/${plan.id}` as any)}
                  style={[
                    s.planCard,
                    {
                      backgroundColor: isFeatured ? palette.primary : palette.bgCard,
                      borderColor:     isFeatured ? palette.primaryDark : palette.borderLight,
                      borderWidth:     1,
                      // Explicit shadow so cards pop in both modes
                      shadowColor:     isFeatured ? palette.primary : '#000',
                      shadowOffset:    { width: 0, height: 4 },
                      shadowOpacity:   isFeatured ? 0.5 : 0.12,
                      shadowRadius:    10,
                      elevation:       isFeatured ? 8 : 3,
                    },
                  ]}
                >
                  {/* Left accent stripe on non-featured */}
                  {!isFeatured && (
                    <View style={[s.planStripe, { backgroundColor: palette.primary }]} />
                  )}

                  <Text style={[s.planNivel, { color: isFeatured ? 'rgba(255,255,255,0.7)' : palette.primary }]}>
                    {plan.nivel.toUpperCase()}
                  </Text>
                  <Text style={[s.planName, { color: isFeatured ? '#FFFFFF' : palette.textPrimary }]}>
                    {plan.nombre}
                  </Text>

                  <View style={s.planFooter}>
                    <View style={[s.planDurPill, { backgroundColor: isFeatured ? 'rgba(0,0,0,0.2)' : palette.bgElevated }]}>
                      <Text style={[s.planDur, { color: isFeatured ? '#FFFFFF' : palette.textSecondary }]}>
                        {plan.duracion_semanas} sem
                      </Text>
                    </View>
                    <IconSymbol size={14} name="chevron.right" color={isFeatured ? 'rgba(255,255,255,0.8)' : palette.primary} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>


        {/* ── Ejercicios recientes ── */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: palette.textMuted }]}>EJERCICIOS RECIENTES</Text>
          {exercises.map((ex, i) => (
            <View
              key={ex.id}
              style={[
                s.listRow,
                i < exercises.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: palette.border },
              ]}
            >
              <View style={[s.listIcon, { backgroundColor: palette.bgElevated, borderColor: palette.border }]}>
                <IconSymbol size={16} name="dumbbell.fill" color={palette.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.listTitle, { color: palette.textPrimary }]}>{ex.nombre}</Text>
                <Text style={[s.listSub,   { color: palette.textMuted }]}>{ex.grupo_muscular}</Text>
              </View>
              <IconSymbol size={14} name="chevron.right" color={palette.textMuted} />
            </View>
          ))}
        </View>

        {/* ── Comidas de hoy ── */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: palette.textMuted }]}>COMIDAS DE HOY</Text>
          {meals.map((meal, i) => (
            <View
              key={meal.id}
              style={[
                s.listRow,
                i < meals.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: palette.border },
              ]}
            >
              <View style={[s.listIcon, { backgroundColor: palette.bgElevated, borderColor: palette.border }]}>
                <IconSymbol size={16} name="fork.knife" color={palette.primary} />
              </View>
              <Text style={[s.listTitle, { color: palette.textPrimary, flex: 1 }]}>{meal.nombre}</Text>
              <Text style={[s.calBadge, { color: palette.primary }]}>{meal.calorias} kcal</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll:    { flex: 1 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20,
  },
  greeting:  { fontSize: 13, fontWeight: '500', letterSpacing: 0.2, marginBottom: 4 },
  appTitle:  { fontSize: 32, fontWeight: '800', letterSpacing: -0.8 },
  themeBtn:  {
    width: 44, height: 44, borderRadius: 14, marginTop: 4,
    borderWidth: 0.5, justifyContent: 'center', alignItems: 'center',
  },

  // Hero card
  heroCard: {
    marginHorizontal: 20, borderRadius: 20, padding: 24,
    marginBottom: 20, flexDirection: 'row', alignItems: 'center',
    overflow: 'hidden',
  },
  heroContent: { flex: 1 },
  heroEyebrow: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 2, marginBottom: 6 },
  heroTitle:   { fontSize: 26, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 6 },
  heroSub:     { fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 18 },
  heroCircle:  { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center' },

  // Stats
  statsRow: { flexDirection: 'row', marginHorizontal: 20, gap: 8, marginBottom: 28 },
  statCard: { flex: 1, borderRadius: 14, paddingVertical: 16, alignItems: 'center', borderWidth: 1 },
  statValue: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 9, fontWeight: '600', letterSpacing: 0.8, textAlign: 'center' },

  // Section
  section: { paddingHorizontal: 20, marginBottom: 28 },
  sectionTitle: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 16 },
  hScroll: { paddingRight: 20 },

  // Tips
  tipRow:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 12 },
  tipIcon:  { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  tipLabel: { flex: 1, fontSize: 13, fontWeight: '500' },
  tipValue: { fontSize: 13, fontWeight: '700' },

  // Plan cards
  planCard:    { borderRadius: 16, padding: 18, marginRight: 12, width: 162, overflow: 'hidden' },
  planStripe:  { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 },
  planNivel:   { fontSize: 9, fontWeight: '700', letterSpacing: 1.2, marginBottom: 8, marginLeft: 4 },
  planName:    { fontSize: 14, fontWeight: '700', marginBottom: 16, lineHeight: 20, marginLeft: 4 },
  planFooter:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  planDurPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  planDur:     { fontSize: 11, fontWeight: '600' },

  // List rows
  listRow:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 12 },
  listIcon: { width: 38, height: 38, borderRadius: 10, borderWidth: 0.5, justifyContent: 'center', alignItems: 'center' },
  listTitle:{ fontSize: 14, fontWeight: '600', marginBottom: 2 },
  listSub:  { fontSize: 11 },
  calBadge: { fontSize: 13, fontWeight: '700' },
});
