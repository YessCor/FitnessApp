import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { Palette } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

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
  const delta    = (cur: number, prev: number) => { const d = cur - prev; return `${d > 0 ? '+' : ''}${d.toFixed(1)}`; };
  const deltaIsNeg = (cur: number, prev: number) => cur - prev < 0;

  const current     = progress[0]?.peso ?? 0;
  const initial     = progress[progress.length - 1]?.peso ?? current;
  const totalChange = current - initial;

  // Chart data
  const weights = progress.map(p => p.peso);
  const minW    = Math.min(...weights);
  const maxW    = Math.max(...weights);
  const range   = maxW - minW || 1;
  const barH    = (w: number) => Math.max(8, ((w - minW) / range) * 72);

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
        <Text style={s.title}>PROGRESO</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={s.loader}><ActivityIndicator size="large" color={Palette.primary} /></View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Stats */}
          <View style={s.statsRow}>
            <View style={s.statCard}>
              <Text style={s.statValue}>{current.toFixed(1)}</Text>
              <Text style={s.statUnit}>kg</Text>
              <Text style={s.statLabel}>PESO ACTUAL</Text>
            </View>
            <View style={s.statCard}>
              <Text style={[s.statValue, { color: totalChange < 0 ? '#4ADE80' : totalChange > 0 ? '#F87171' : Palette.textPrimary }]}>
                {totalChange > 0 ? '+' : ''}{totalChange.toFixed(1)}
              </Text>
              <Text style={s.statUnit}>kg</Text>
              <Text style={s.statLabel}>CAMBIO</Text>
            </View>
            <View style={s.statCard}>
              <Text style={s.statValue}>{progress.length}</Text>
              <Text style={s.statUnit}>sem</Text>
              <Text style={s.statLabel}>REGISTROS</Text>
            </View>
          </View>

          {/* Chart */}
          <View style={s.chartCard}>
            <Text style={s.chartTitle}>EVOLUCIÓN DE PESO</Text>
            <View style={s.chart}>
              {[...progress].reverse().map((p, i) => {
                const isLatest = i === progress.length - 1;
                return (
                  <View key={p.id} style={s.barCol}>
                    <View style={[
                      s.bar,
                      { height: barH(p.peso) },
                      isLatest ? s.barActive : s.barInactive,
                    ]} />
                    <Text style={[s.barLabel, isLatest && s.barLabelActive]}>
                      {p.peso.toFixed(0)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Historial */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>HISTORIAL</Text>
            {progress.map((p, i) => {
              const prevW  = progress[i + 1]?.peso;
              const change = prevW ? delta(p.peso, prevW) : null;
              const isDown = prevW ? deltaIsNeg(p.peso, prevW) : false;

              return (
                <View key={p.id} style={[s.historyRow, i < progress.length - 1 && s.historyBorder]}>
                  <View style={s.historyLeft}>
                    <Text style={s.historyDate}>{fmtDate(p.fecha)}</Text>
                    {p.notas && <Text style={s.historyNote}>{p.notas}</Text>}
                  </View>
                  <View style={s.historyRight}>
                    <Text style={s.historyWeight}>{p.peso.toFixed(1)} <Text style={s.historyUnit}>kg</Text></Text>
                    {change && (
                      <Text style={[s.historyDelta, { color: isDown ? '#4ADE80' : '#F87171' }]}>
                        {change} kg
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <View style={{ height: 80 }} />
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
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 20,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: Palette.bgElevated, borderWidth: 0.5, borderColor: Palette.border,
    justifyContent: 'center', alignItems: 'center',
  },
  title: { fontSize: 12, fontWeight: '700', color: Palette.textPrimary, letterSpacing: 2 },

  statsRow: { flexDirection: 'row', marginHorizontal: 20, gap: 8, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: Palette.bgCard,
    borderRadius: 12, paddingVertical: 18, alignItems: 'center',
    borderWidth: 0.5, borderColor: Palette.border,
  },
  statValue: { fontSize: 22, fontWeight: '700', color: Palette.textPrimary },
  statUnit:  { fontSize: 10, color: Palette.textMuted, fontWeight: '600', marginBottom: 6 },
  statLabel: { fontSize: 9,  color: Palette.textMuted, fontWeight: '700', letterSpacing: 1 },

  chartCard: {
    marginHorizontal: 20, backgroundColor: Palette.bgCard,
    borderRadius: 14, padding: 18, marginBottom: 24,
    borderWidth: 0.5, borderColor: Palette.border,
  },
  chartTitle: {
    color: Palette.textMuted, fontSize: 9, fontWeight: '700',
    letterSpacing: 1.5, marginBottom: 20,
  },
  chart: {
    flexDirection: 'row', height: 88, alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  barCol:        { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar:           { width: 22, borderRadius: 4, marginBottom: 6 },
  barActive:     { backgroundColor: Palette.textPrimary },
  barInactive:   { backgroundColor: Palette.bgElevated, borderWidth: 0.5, borderColor: Palette.border },
  barLabel:      { color: Palette.textMuted, fontSize: 9, fontWeight: '600' },
  barLabelActive:{ color: Palette.textPrimary },

  section:      { paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 10, fontWeight: '700', color: Palette.textMuted,
    letterSpacing: 1.5, marginBottom: 14,
  },

  historyRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16,
  },
  historyBorder: { borderBottomWidth: 0.5, borderBottomColor: Palette.border },
  historyLeft:   { flex: 1 },
  historyDate:   { color: Palette.textPrimary, fontSize: 13, fontWeight: '600', marginBottom: 3 },
  historyNote:   { color: Palette.textMuted, fontSize: 11 },
  historyRight:  { alignItems: 'flex-end', gap: 4 },
  historyWeight: { color: Palette.textPrimary, fontSize: 22, fontWeight: '700' },
  historyUnit:   { fontSize: 12, color: Palette.textMuted },
  historyDelta:  { fontSize: 11, fontWeight: '700' },
});
