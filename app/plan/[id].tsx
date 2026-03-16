import React, { useState, useEffect } from 'react';
import {
  ScrollView, View, Text, TouchableOpacity,
  StatusBar, ActivityIndicator,
} from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '@/hooks/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

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
    { id: 1, series: 3, repeticiones: 12, ejercicio: { id: 1, nombre: 'Press de Banca', grupoMuscular: 'Pecho',   descripcion: 'Ejercicio para pectorales' } },
    { id: 2, series: 3, repeticiones: 15, ejercicio: { id: 2, nombre: 'Sentadillas',    grupoMuscular: 'Piernas', descripcion: 'Ejercicio para cuadriceps' } },
    { id: 3, series: 3, repeticiones: 10, ejercicio: { id: 3, nombre: 'Peso Muerto',    grupoMuscular: 'Espalda', descripcion: 'Ejercicio para espalda'   } },
    { id: 4, series: 4, repeticiones: 12, ejercicio: { id: 4, nombre: 'Press Militar',  grupoMuscular: 'Hombros', descripcion: 'Ejercicio para hombros'   } },
  ],
};

export default function PlanDetailScreen() {
  const { id }                    = useLocalSearchParams();
  const { palette, isDark }       = useAppTheme();
  const [plan,    setPlan]        = useState<PlanEntrenamiento | null>(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => { fetchPlan(); }, [id]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/planes/${id as string}`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const d = await res.json();
        setPlan(d.ejerciciosPlan ? d : { ...DEFAULT_PLAN, id: parseInt(id as string), nombre: d.nombre ?? DEFAULT_PLAN.nombre });
      } else { setPlan(DEFAULT_PLAN); }
    } catch { setPlan(DEFAULT_PLAN); }
    finally  { setLoading(false); }
  };

  if (loading) return (
    <View style={{ flex: 1, backgroundColor: palette.bgDeep, justifyContent: 'center', alignItems: 'center' }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={palette.bgDeep} />
      <ActivityIndicator size="large" color={palette.primary} />
    </View>
  );

  if (!plan) return (
    <View style={{ flex: 1, backgroundColor: palette.bgDeep, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: palette.textPrimary, fontSize: 16 }}>Plan no encontrado</Text>
    </View>
  );

  const totalSeries = plan.ejerciciosPlan.reduce((a, e) => a + e.series, 0);
  const totalReps   = plan.ejerciciosPlan.reduce((a, e) => a + e.repeticiones, 0);

  return (
    <View style={{ flex: 1, backgroundColor: palette.bgDeep }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={palette.bgDeep} />

      {/* ── Header ── */}
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16,
        borderBottomWidth: 0.5, borderBottomColor: palette.border,
      }}>
        <Link href="/(tabs)" asChild>
          <TouchableOpacity style={{
            width: 40, height: 40, borderRadius: 12,
            backgroundColor: palette.bgElevated,
            borderWidth: 0.5, borderColor: palette.border,
            justifyContent: 'center', alignItems: 'center',
          }}>
            <IconSymbol size={18} name="arrow.left" color={palette.textPrimary} />
          </TouchableOpacity>
        </Link>
        <Text style={{ fontSize: 12, fontWeight: '700', color: palette.textPrimary, letterSpacing: 2 }}>
          DETALLE DEL PLAN
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

        {/* ── Hero Card ── */}
        <View style={{
          marginHorizontal: 20, marginTop: 20, marginBottom: 24,
          backgroundColor: palette.primary,
          borderRadius: 22, padding: 22,
          overflow: 'hidden',
        }}>
          {/* Decorative circle */}
          <View style={{
            position: 'absolute', right: -20, top: -20,
            width: 120, height: 120, borderRadius: 60,
            backgroundColor: 'rgba(255,255,255,0.1)',
          }} />
          <View style={{
            position: 'absolute', right: 20, bottom: -30,
            width: 80, height: 80, borderRadius: 40,
            backgroundColor: 'rgba(255,255,255,0.07)',
          }} />

          <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '700', letterSpacing: 2, marginBottom: 10 }}>
            PLAN DE ENTRENAMIENTO
          </Text>
          <Text style={{ fontSize: 26, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 10 }}>
            {plan.nombre}
          </Text>

          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>{plan.nivel}</Text>
            </View>
            <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600' }}>
                {plan.duracionSemanas} semanas
              </Text>
            </View>
          </View>

          {/* Stats bar */}
          <View style={{
            flexDirection: 'row',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: 14, padding: 14,
          }}>
            {[
              { value: plan.ejerciciosPlan.length, label: 'EJERCICIOS' },
              { value: totalSeries,                label: 'SERIES'     },
              { value: totalReps,                  label: 'REPS TOTAL' },
            ].map((stat, i, arr) => (
              <React.Fragment key={stat.label}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 2 }}>{stat.value}</Text>
                  <Text style={{ fontSize: 8, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 1 }}>{stat.label}</Text>
                </View>
                {i < arr.length - 1 && (
                  <View style={{ width: 0.5, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── Ejercicios ── */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{
            fontSize: 10, fontWeight: '700', color: palette.textMuted,
            letterSpacing: 1.5, marginBottom: 16,
          }}>
            EJERCICIOS DEL PLAN
          </Text>

          {plan.ejerciciosPlan.map((ep, index) => (
            <View
              key={ep.id}
              style={{
                backgroundColor: palette.bgCard,
                borderRadius: 16, padding: 16,
                marginBottom: 10,
                borderWidth: 0.5, borderColor: palette.border,
                flexDirection: 'row', alignItems: 'center',
              }}
            >
              {/* Number badge */}
              <View style={{
                width: 40, height: 40, borderRadius: 12,
                backgroundColor: palette.primaryGlow,
                justifyContent: 'center', alignItems: 'center',
                marginRight: 14,
              }}>
                <Text style={{ color: palette.primary, fontWeight: '800', fontSize: 15 }}>
                  {index + 1}
                </Text>
              </View>

              {/* Info */}
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={{ color: palette.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: 3 }}>
                  {ep.ejercicio.nombre}
                </Text>
                <Text style={{ color: palette.primary, fontSize: 11, fontWeight: '600', marginBottom: ep.ejercicio.descripcion ? 3 : 0 }}>
                  {ep.ejercicio.grupoMuscular}
                </Text>
                {ep.ejercicio.descripcion && (
                  <Text style={{ color: palette.textMuted, fontSize: 11 }}>{ep.ejercicio.descripcion}</Text>
                )}
              </View>

              {/* Series × Reps */}
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: palette.primary, fontSize: 20, fontWeight: '800' }}>{ep.series}</Text>
                <Text style={{ color: palette.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 0.5 }}>SERIES</Text>
                <Text style={{ color: palette.textMuted, fontSize: 10, marginVertical: 2 }}>×</Text>
                <Text style={{ color: palette.textPrimary, fontSize: 20, fontWeight: '800' }}>{ep.repeticiones}</Text>
                <Text style={{ color: palette.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 0.5 }}>REPS</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}
