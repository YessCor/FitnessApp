import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Palette } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

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
  perder_grasa:  { label: 'Déficit calórico', icon: 'flame.fill'    },
  ganar_musculo: { label: 'Superávit',         icon: 'dumbbell.fill'  },
  mantenimiento: { label: 'Equilibrado',        icon: 'scalemass.fill' },
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
      calories:      acc.calories      + c.calorias,
      proteina:      acc.proteina      + c.proteina,
      carbohidratos: acc.carbohidratos + c.carbohidratos,
      grasa:         acc.grasa         + c.grasa,
    }), { calories: 0, proteina: 0, carbohidratos: 0, grasa: 0 });

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
        <Text style={s.title}>NUTRICIÓN</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={s.loader}><ActivityIndicator size="large" color={Palette.primary} /></View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
          <Text style={s.sectionLabel}>PLANES NUTRICIONALES</Text>

          {plans.map((plan) => {
            const meta   = OBJ_META[plan.objetivo] ?? OBJ_META.mantenimiento;
            const isOpen = selectedPlan?.id === plan.id;
            const totals = getTotals(plan);

            return (
              <TouchableOpacity
                key={plan.id}
                style={[s.planCard, isOpen && s.planCardOpen]}
                onPress={() => setSelectedPlan(isOpen ? null : plan)}
                activeOpacity={0.8}
              >
                {/* Card header */}
                <View style={s.planCardHeader}>
                  <View style={s.planIconWrap}>
                    <IconSymbol size={18} name={meta.icon} color={Palette.textSecondary} />
                  </View>
                  <View style={s.planTitleWrap}>
                    <Text style={s.planName}>{plan.nombre}</Text>
                    <Text style={s.planMeta}>{meta.label}</Text>
                  </View>
                  <IconSymbol
                    size={16}
                    name={isOpen ? 'chevron.up' : 'chevron.down'}
                    color={Palette.textMuted}
                  />
                </View>

                {/* Expanded detail */}
                {isOpen && (
                  <View style={s.planDetail}>
                    {/* Macros */}
                    <View style={s.macroRow}>
                      {[
                        { label: 'KCAL',     value: String(totals.calories)      },
                        { label: 'PROT',     value: `${totals.proteina}g`        },
                        { label: 'CARBS',    value: `${totals.carbohidratos}g`   },
                        { label: 'GRASA',    value: `${totals.grasa}g`           },
                      ].map(m => (
                        <View key={m.label} style={s.macroItem}>
                          <Text style={s.macroValue}>{m.value}</Text>
                          <Text style={s.macroLabel}>{m.label}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Comidas */}
                    <Text style={s.mealsLabel}>COMIDAS</Text>
                    {plan.comidas.map((c, i) => (
                      <View key={c.id} style={[s.mealRow, i < plan.comidas.length - 1 && s.mealRowBorder]}>
                        <View style={s.mealIconWrap}>
                          <IconSymbol size={16} name="fork.knife" color={Palette.textSecondary} />
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
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 20,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: Palette.bgElevated, borderWidth: 0.5, borderColor: Palette.border,
    justifyContent: 'center', alignItems: 'center',
  },
  title: { fontSize: 12, fontWeight: '700', color: Palette.textPrimary, letterSpacing: 2 },

  sectionLabel: {
    fontSize: 10, fontWeight: '700', color: Palette.textMuted,
    letterSpacing: 1.5, marginBottom: 14, marginTop: 4,
  },

  planCard: {
    backgroundColor: Palette.bgCard, borderRadius: 14, padding: 16,
    marginBottom: 10, borderWidth: 0.5, borderColor: Palette.border,
  },
  planCardOpen: { borderColor: Palette.borderLight },
  planCardHeader: { flexDirection: 'row', alignItems: 'center' },
  planIconWrap:   {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: Palette.bgElevated,
    borderWidth: 0.5, borderColor: Palette.border,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  planTitleWrap: { flex: 1 },
  planName:      { color: Palette.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: 3 },
  planMeta:      { color: Palette.textMuted, fontSize: 11 },

  planDetail: { marginTop: 16, paddingTop: 16, borderTopWidth: 0.5, borderTopColor: Palette.border },

  macroRow:   { flexDirection: 'row', marginBottom: 18, gap: 8 },
  macroItem:  {
    flex: 1, backgroundColor: Palette.bgElevated, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center',
    borderWidth: 0.5, borderColor: Palette.border,
  },
  macroValue: { fontSize: 16, fontWeight: '700', color: Palette.textPrimary, marginBottom: 4 },
  macroLabel: { color: Palette.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 1 },

  mealsLabel:  { color: Palette.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10 },
  mealRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  mealRowBorder: { borderBottomWidth: 0.5, borderBottomColor: Palette.border },
  mealIconWrap: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: Palette.bgDeep,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  mealInfo:   { flex: 1 },
  mealName:   { color: Palette.textPrimary,   fontSize: 13, fontWeight: '600', marginBottom: 2 },
  mealMacros: { color: Palette.textMuted, fontSize: 10 },
});
