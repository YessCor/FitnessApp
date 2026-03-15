import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { Palette } from '@/constants/theme';

const API_BASE = 'http://10.0.2.2:3000';

interface Progreso { id: number; fecha: string; peso: number; notas: string | null; }

const DEFAULT_PROGRESS: Progreso[] = [
  { id: 1, fecha: '2024-01-29', peso: 77.9, notas: 'Casi en meta' },
  { id: 2, fecha: '2024-01-22', peso: 78.5, notas: 'Metiendo más cardio' },
  { id: 3, fecha: '2024-01-15', peso: 79.2, notas: 'Buen progreso' },
  { id: 4, fecha: '2024-01-08', peso: 79.8, notas: 'Primera semana completada' },
  { id: 5, fecha: '2024-01-01', peso: 80.5, notas: 'Inicio del programa' },
];

export default function ProgressScreen() {
  const [progress, setProgress] = useState<Progreso[]>(DEFAULT_PROGRESS);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => { fetchProgress(); }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/progreso`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) { const d = await res.json(); if (d.length) setProgress(d); }
    } catch {}
    finally { setLoading(false); }
  };

  const fmtDate  = (str: string) => new Date(str).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  const delta    = (cur: number, prev: number) => { const d = cur - prev; return `${d > 0 ? '+' : ''}${d.toFixed(1)} kg`; };
  const deltaCol = (d: number) => d < 0 ? Palette.success : d > 0 ? Palette.danger : Palette.textMuted;

  const current      = progress[0]?.peso ?? 0;
  const initial      = progress[progress.length - 1]?.peso ?? current;
  const totalChange  = current - initial;

  // Chart data
  const weights  = progress.map(p => p.peso);
  const minW     = Math.min(...weights);
  const maxW     = Math.max(...weights);
  const range    = maxW - minW || 1;
  const barH     = (w: number) => Math.max(12, ((w - minW) / range) * 80);

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bgDeep} />

      <View style={s.header}>
        <Link href="/" asChild>
          <TouchableOpacity style={s.backBtn}><Text style={s.backArrow}>←</Text></TouchableOpacity>
        </Link>
        <Text style={s.title}>Progreso</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={s.loader}><ActivityIndicator size="large" color={Palette.primary} /></View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Stats */}
          <View style={s.statsRow}>
            <View style={s.statCard}>
              <Text style={[s.statValue, { color: Palette.primary }]}>{current.toFixed(1)}</Text>
              <Text style={s.statLabel}>Peso Actual (kg)</Text>
            </View>
            <View style={s.statCard}>
              <Text style={[s.statValue, { color: deltaCol(totalChange) }]}>
                {totalChange > 0 ? '+' : ''}{totalChange.toFixed(1)}
              </Text>
              <Text style={s.statLabel}>Cambio Total (kg)</Text>
            </View>
            <View style={s.statCard}>
              <Text style={[s.statValue, { color: Palette.secondary }]}>{progress.length}</Text>
              <Text style={s.statLabel}>Semanas</Text>
            </View>
          </View>

          {/* Chart */}
          <View style={s.chartCard}>
            <Text style={s.chartTitle}>Peso a lo Largo del Tiempo</Text>
            <View style={s.chart}>
              {[...progress].reverse().map((p, i) => (
                <View key={p.id} style={s.barCol}>
                  <View style={[s.bar, { height: barH(p.peso), backgroundColor: i === progress.length - 1 ? Palette.primary : Palette.bgElevated }]} />
                  <Text style={s.barLabel}>{p.peso.toFixed(0)}</Text>
                </View>
              ))}
            </View>
            <View style={s.chartLegend}>
              <View style={[s.legendDot, { backgroundColor: Palette.primary }]} />
              <Text style={s.legendText}>Peso más reciente</Text>
              <View style={[s.legendDot, { backgroundColor: Palette.bgElevated, marginLeft: 12 }]} />
              <Text style={s.legendText}>Anteriores</Text>
            </View>
          </View>

          {/* Historial */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Historial</Text>
            {progress.map((p, i) => {
              const prevW  = progress[i + 1]?.peso;
              const change = prevW ? p.peso - prevW : 0;
              return (
                <View key={p.id} style={s.historyCard}>
                  <View style={s.historyLeft}>
                    <Text style={s.historyDate}>{fmtDate(p.fecha)}</Text>
                    {p.notas && <Text style={s.historyNote}>{p.notas}</Text>}
                  </View>
                  <View style={s.historyRight}>
                    <Text style={s.historyWeight}>{p.peso.toFixed(1)} <Text style={s.historyUnit}>kg</Text></Text>
                    {i < progress.length - 1 && prevW && (
                      <View style={[s.changeBadge, { backgroundColor: deltaCol(change) + '22' }]}>
                        <Text style={[s.changeText, { color: deltaCol(change) }]}>{delta(p.peso, prevW)}</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.bgDeep },
  loader:    { flex: 1, justifyContent: 'center', alignItems: 'center' },

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

  statsRow: { flexDirection: 'row', marginHorizontal: 20, gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: Palette.bgCard,
    borderRadius: 16, paddingVertical: 16, alignItems: 'center',
    borderWidth: 1, borderColor: Palette.border,
  },
  statValue: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 10, color: Palette.textSecondary, fontWeight: '500', textAlign: 'center' },

  chartCard: {
    marginHorizontal: 20, backgroundColor: Palette.bgCard,
    borderRadius: 20, padding: 18, marginBottom: 24,
    borderWidth: 1, borderColor: Palette.border,
  },
  chartTitle: { color: Palette.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: 16 },
  chart:      { flexDirection: 'row', height: 100, alignItems: 'flex-end', justifyContent: 'space-around', marginBottom: 12 },
  barCol:     { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar:        { width: 26, borderRadius: 8, marginBottom: 4 },
  barLabel:   { color: Palette.textMuted, fontSize: 9 },
  chartLegend:{ flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  legendDot:  { width: 8, height: 8, borderRadius: 4, marginRight: 5 },
  legendText: { color: Palette.textSecondary, fontSize: 11 },

  section:      { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Palette.textPrimary, marginBottom: 14 },

  historyCard: {
    backgroundColor: Palette.bgCard, borderRadius: 16, padding: 16, marginBottom: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: Palette.border,
  },
  historyLeft:   { flex: 1 },
  historyDate:   { color: Palette.textPrimary,   fontSize: 13, fontWeight: '700', marginBottom: 3 },
  historyNote:   { color: Palette.textSecondary, fontSize: 11, fontStyle: 'italic' },
  historyRight:  { alignItems: 'flex-end', gap: 6 },
  historyWeight: { color: Palette.textPrimary, fontSize: 24, fontWeight: '800' },
  historyUnit:   { fontSize: 14, color: Palette.textSecondary },
  changeBadge:   { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  changeText:    { fontSize: 11, fontWeight: '700' },
});
