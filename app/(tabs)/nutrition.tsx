import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppTheme } from '@/hooks/ThemeContext';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, ScrollView, StatusBar,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

const API_BASE = 'http://10.9.220.193:3000';

interface Comida {
  id: number; nombre: string;
  calorias: number; proteina: number; carbohidratos: number; grasa: number;
}
interface PlanNutricion {
  id: number; nombre: string; objetivo: string; comidas: Comida[];
}

const DEFAULT_PLANS: PlanNutricion[] = [
  {
    id: 1, nombre: 'Perder Grasa', objetivo: 'perder_grasa',
    comidas: [
      { id: 1, nombre: 'Desayuno Proteico',      calorias: 350, proteina: 30, carbohidratos: 25, grasa: 10 },
      { id: 2, nombre: 'Almuerzo Bajo en Carbs', calorias: 450, proteina: 40, carbohidratos: 30, grasa: 15 },
      { id: 3, nombre: 'Cena Ligera',            calorias: 300, proteina: 35, carbohidratos: 20, grasa: 8  },
    ],
  },
  {
    id: 2, nombre: 'Ganar Músculo', objetivo: 'ganar_musculo',
    comidas: [
      { id: 4, nombre: 'Desayuno Calórico',      calorias: 600, proteina: 40, carbohidratos: 60, grasa: 20 },
      { id: 5, nombre: 'Almuerzo Hiperproteico', calorias: 700, proteina: 50, carbohidratos: 70, grasa: 25 },
      { id: 6, nombre: 'Cena Proteica',          calorias: 550, proteina: 45, carbohidratos: 50, grasa: 18 },
    ],
  },
  {
    id: 3, nombre: 'Mantenimiento', objetivo: 'mantenimiento',
    comidas: [
      { id: 7, nombre: 'Desayuno Balanceado',  calorias: 450, proteina: 25, carbohidratos: 45, grasa: 15 },
      { id: 8, nombre: 'Almuerzo Equilibrado', calorias: 500, proteina: 30, carbohidratos: 50, grasa: 18 },
      { id: 9, nombre: 'Cena Moderada',        calorias: 400, proteina: 28, carbohidratos: 40, grasa: 12 },
    ],
  },
];

type NutriIconName = 'flame.fill' | 'dumbbell.fill' | 'scalemass.fill';

const OBJ_META: Record<string, { label: string; icon: NutriIconName }> = {
  perder_grasa:  { label: 'Déficit calórico', icon: 'flame.fill' },
  ganar_musculo: { label: 'Superávit',         icon: 'dumbbell.fill' },
  mantenimiento: { label: 'Equilibrado',        icon: 'scalemass.fill' },
};

export default function NutritionScreen() {
  const { palette, isDark } = useAppTheme();
  const [plans,        setPlans]        = useState<PlanNutricion[]>(DEFAULT_PLANS);
  const [loading,      setLoading]      = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanNutricion | null>(null);

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/planes-nutricion`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) { const d = await res.json(); if (d.length) setPlans(d); }
    } catch {}
    finally { setLoading(false); }
  };

  const getTotals = (plan: PlanNutricion) =>
    plan.comidas.reduce((acc, c) => ({
      calories:      acc.calories + c.calorias,
      proteina:      acc.proteina + c.proteina,
      carbohidratos: acc.carbohidratos + c.carbohidratos,
      grasa:         acc.grasa + c.grasa,
    }), { calories: 0, proteina: 0, carbohidratos: 0, grasa: 0 });

  return (
    <View style={{ flex: 1, backgroundColor: palette.bgDeep }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={palette.bgDeep} />

      {/* Header */}
      <View style={[s.header, { borderBottomColor: palette.border, borderBottomWidth: 0.5 }]}>
        <Text style={[s.title, { color: palette.textPrimary }]}>Nutrición</Text>
        <Text style={[s.subtitle, { color: palette.textSecondary }]}>{plans.length} planes disponibles</Text>
      </View>

      {loading ? (
        <View style={s.loader}><ActivityIndicator size="large" color={palette.primary} /></View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {plans.map((plan) => {
            const meta   = OBJ_META[plan.objetivo] ?? OBJ_META.mantenimiento;
            const isOpen = selectedPlan?.id === plan.id;
            const totals = getTotals(plan);

            return (
              <TouchableOpacity
                key={plan.id}
                style={[
                  s.planCard,
                  {
                    backgroundColor: palette.bgCard,
                    borderColor: isOpen ? palette.primary : palette.border,
                  },
                ]}
                onPress={() => setSelectedPlan(isOpen ? null : plan)}
                activeOpacity={0.8}
              >
                <View style={s.planCardHeader}>
                  <View style={[s.planIconWrap, {
                    backgroundColor: isOpen ? palette.primaryGlow : palette.bgElevated,
                    borderColor: palette.border,
                  }]}>
                    <IconSymbol size={18} name={meta.icon} color={isOpen ? palette.primary : palette.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.planName, { color: palette.textPrimary }]}>{plan.nombre}</Text>
                    <Text style={[s.planMeta, { color: palette.textMuted }]}>{meta.label}</Text>
                  </View>
                  <IconSymbol
                    size={16}
                    name={isOpen ? 'chevron.up' : 'chevron.down'}
                    color={isOpen ? palette.primary : palette.textMuted}
                  />
                </View>

                {isOpen && (
                  <View style={[s.planDetail, { borderTopColor: palette.border }]}>
                    <View style={s.macroRow}>
                      {[
                        { label: 'KCAL',  value: String(totals.calories)         },
                        { label: 'PROT',  value: `${totals.proteina}g`           },
                        { label: 'CARBS', value: `${totals.carbohidratos}g`      },
                        { label: 'GRASA', value: `${totals.grasa}g`              },
                      ].map(m => (
                        <View key={m.label} style={[s.macroItem, { backgroundColor: palette.bgElevated, borderColor: palette.border }]}>
                          <Text style={[s.macroValue, { color: palette.textPrimary }]}>{m.value}</Text>
                          <Text style={[s.macroLabel, { color: palette.textMuted }]}>{m.label}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={[s.mealsLabel, { color: palette.textMuted }]}>COMIDAS</Text>
                    {plan.comidas.map((c, i) => (
                      <View
                        key={c.id}
                        style={[
                          s.mealRow,
                          i < plan.comidas.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: palette.border },
                        ]}
                      >
                        <View style={[s.mealIconWrap, { backgroundColor: palette.bgDeep }]}>
                          <IconSymbol size={15} name="fork.knife" color={palette.textSecondary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[s.mealName, { color: palette.textPrimary }]}>{c.nombre}</Text>
                          <Text style={[s.mealMacros, { color: palette.textMuted }]}>
                            {c.calorias} kcal · {c.proteina}g P · {c.carbohidratos}g C · {c.grasa}g G
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 120 }} />
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20 },
  title:    { fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 4 },
  loader:   { flex: 1, justifyContent: 'center', alignItems: 'center' },
  planCard: {
    borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1,
  },
  planCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  planIconWrap:   { width: 42, height: 42, borderRadius: 12, borderWidth: 0.5, justifyContent: 'center', alignItems: 'center' },
  planName:       { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  planMeta:       { fontSize: 11 },
  planDetail:     { marginTop: 16, paddingTop: 16, borderTopWidth: 0.5 },
  macroRow:       { flexDirection: 'row', gap: 8, marginBottom: 18 },
  macroItem:      { flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center', borderWidth: 0.5 },
  macroValue:     { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  macroLabel:     { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  mealsLabel:     { fontSize: 9, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10 },
  mealRow:        { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  mealIconWrap:   { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  mealName:       { fontSize: 13, fontWeight: '600', marginBottom: 2 },
  mealMacros:     { fontSize: 10 },
});
