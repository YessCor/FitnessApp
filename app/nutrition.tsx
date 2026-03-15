import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Palette } from '@/constants/theme';

const API_BASE = 'http://10.0.2.2:3000';

interface Comida {
  id: number; nombre: string;
  calorias: number; proteina: number; carbohidratos: number; grasa: number;
}
interface PlanNutricion {
  id: number; nombre: string; objetivo: string; comidas: Comida[];
}

const DEFAULT_PLANS: PlanNutricion[] = [
  {
    id: 1, nombre: 'Plan Perder Grasa', objetivo: 'perder_grasa',
    comidas: [
      { id: 1, nombre: 'Desayuno Proteico',      calorias: 350, proteina: 30, carbohidratos: 25, grasa: 10 },
      { id: 2, nombre: 'Almuerzo Bajo en Carbs', calorias: 450, proteina: 40, carbohidratos: 30, grasa: 15 },
      { id: 3, nombre: 'Cena Ligera',            calorias: 300, proteina: 35, carbohidratos: 20, grasa: 8  },
    ],
  },
  {
    id: 2, nombre: 'Plan Ganar Músculo', objetivo: 'ganar_musculo',
    comidas: [
      { id: 4, nombre: 'Desayuno Calórico',       calorias: 600, proteina: 40, carbohidratos: 60, grasa: 20 },
      { id: 5, nombre: 'Almuerzo Hiperproteico',  calorias: 700, proteina: 50, carbohidratos: 70, grasa: 25 },
      { id: 6, nombre: 'Cena Proteica',           calorias: 550, proteina: 45, carbohidratos: 50, grasa: 18 },
    ],
  },
  {
    id: 3, nombre: 'Plan Mantenimiento', objetivo: 'mantenimiento',
    comidas: [
      { id: 7, nombre: 'Desayuno Balanceado', calorias: 450, proteina: 25, carbohidratos: 45, grasa: 15 },
      { id: 8, nombre: 'Almuerzo Equilibrado',calorias: 500, proteina: 30, carbohidratos: 50, grasa: 18 },
      { id: 9, nombre: 'Cena Moderada',       calorias: 400, proteina: 28, carbohidratos: 40, grasa: 12 },
    ],
  },
];

const OBJ_META: Record<string, { label: string; color: string; icon: string }> = {
  perder_grasa:  { label: 'Perder Grasa',   color: Palette.danger,    icon: '🔥' },
  ganar_musculo: { label: 'Ganar Músculo',  color: Palette.secondary, icon: '💪' },
  mantenimiento: { label: 'Mantenimiento',  color: Palette.accent,    icon: '⚖️' },
};

export default function NutritionScreen() {
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
      calories: acc.calories + c.calorias,
      proteina: acc.proteina + c.proteina,
      carbohidratos: acc.carbohidratos + c.carbohidratos,
      grasa: acc.grasa + c.grasa,
    }), { calories: 0, proteina: 0, carbohidratos: 0, grasa: 0 });

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bgDeep} />

      <View style={s.header}>
        <Link href="/" asChild>
          <TouchableOpacity style={s.backBtn}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
        </Link>
        <Text style={s.title}>Nutrición</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={s.loader}><ActivityIndicator size="large" color={Palette.primary} /></View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
          <Text style={s.sectionTitle}>Planes Nutricionales</Text>

          {plans.map((plan) => {
            const meta      = OBJ_META[plan.objetivo] ?? OBJ_META.mantenimiento;
            const isOpen    = selectedPlan?.id === plan.id;
            const totals    = getTotals(plan);

            return (
              <TouchableOpacity
                key={plan.id}
                style={[s.planCard, isOpen && { borderColor: meta.color }]}
                onPress={() => setSelectedPlan(isOpen ? null : plan)}
                activeOpacity={0.85}
              >
                {/* Card header */}
                <View style={s.planCardHeader}>
                  <View style={[s.planIconWrap, { backgroundColor: meta.color + '22' }]}>
                    <Text style={s.planIcon}>{meta.icon}</Text>
                  </View>
                  <View style={s.planTitleWrap}>
                    <Text style={s.planName}>{plan.nombre}</Text>
                    <View style={[s.objBadge, { backgroundColor: meta.color + '22' }]}>
                      <Text style={[s.objBadgeText, { color: meta.color }]}>{meta.label}</Text>
                    </View>
                  </View>
                  <Text style={[s.chevron, { color: meta.color }]}>{isOpen ? '▲' : '▼'}</Text>
                </View>

                {/* Expanded detail */}
                {isOpen && (
                  <View style={s.planDetail}>
                    {/* Macros row */}
                    <View style={s.macroRow}>
                      {[
                        { label: 'Kcal',     value: String(totals.calories), color: meta.color },
                        { label: 'Proteína', value: `${totals.proteina}g`,   color: Palette.secondary },
                        { label: 'Carbs',    value: `${totals.carbohidratos}g`, color: Palette.warning },
                        { label: 'Grasa',    value: `${totals.grasa}g`,      color: Palette.danger },
                      ].map(m => (
                        <View key={m.label} style={s.macroItem}>
                          <Text style={[s.macroValue, { color: m.color }]}>{m.value}</Text>
                          <Text style={s.macroLabel}>{m.label}</Text>
                        </View>
                      ))}
                    </View>

                    <Text style={s.mealsLabel}>Comidas del Plan</Text>
                    {plan.comidas.map((c) => (
                      <View key={c.id} style={s.mealRow}>
                        <View style={s.mealIconWrap}>
                          <Text style={s.mealIcon}>🍽️</Text>
                        </View>
                        <View style={s.mealInfo}>
                          <Text style={s.mealName}>{c.nombre}</Text>
                          <Text style={s.mealMacros}>
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

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container:     { flex: 1, backgroundColor: Palette.bgDeep },
  loader:        { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20 },

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
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Palette.textPrimary, marginBottom: 16, marginTop: 4 },

  planCard: {
    backgroundColor: Palette.bgCard, borderRadius: 20, padding: 16,
    marginBottom: 12, borderWidth: 1.5, borderColor: Palette.border,
  },
  planCardHeader: { flexDirection: 'row', alignItems: 'center' },
  planIconWrap:   { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  planIcon:       { fontSize: 22 },
  planTitleWrap:  { flex: 1 },
  planName:       { color: Palette.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: 5 },
  objBadge:       { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  objBadgeText:   { fontSize: 11, fontWeight: '700' },
  chevron:        { fontSize: 12, fontWeight: '700' },

  planDetail: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: Palette.border },

  macroRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  macroItem:  { flex: 1, backgroundColor: Palette.bgElevated, borderRadius: 12, padding: 10, alignItems: 'center', marginHorizontal: 3 },
  macroValue: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  macroLabel: { color: Palette.textSecondary, fontSize: 10 },

  mealsLabel: { color: Palette.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 10, letterSpacing: 0.5 },
  mealRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Palette.bgElevated, borderRadius: 12, padding: 12, marginBottom: 8,
  },
  mealIconWrap: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: Palette.secondaryGlow, justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  mealIcon:   { fontSize: 18 },
  mealInfo:   { flex: 1 },
  mealName:   { color: Palette.textPrimary,   fontSize: 13, fontWeight: '700', marginBottom: 3 },
  mealMacros: { color: Palette.textSecondary, fontSize: 11 },
});
