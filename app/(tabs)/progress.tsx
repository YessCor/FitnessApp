import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { useAppTheme } from '@/hooks/ThemeContext';
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
  const { palette, isDark } = useAppTheme();
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

  const fmtDate = (str: string) =>
    new Date(str).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

  const current     = progress[0]?.peso ?? 0;
  const initial     = progress[progress.length - 1]?.peso ?? current;
  const totalChange = current - initial;

  // Chart
  const weights = progress.map(p => p.peso);
  const minW    = Math.min(...weights);
  const maxW    = Math.max(...weights);
  const range   = maxW - minW || 1;
  const barH    = (w: number) => Math.max(8, ((w - minW) / range) * 80);

  return (
    <View style={{ flex: 1, backgroundColor: palette.bgDeep }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={palette.bgDeep} />

      {/* Header */}
      <View style={[s.header, { borderBottomColor: palette.border, borderBottomWidth: 0.5 }]}>
        <Text style={[s.title, { color: palette.textPrimary }]}>Progreso</Text>
        <Text style={[s.subtitle, { color: palette.textSecondary }]}>Últimas {progress.length} semanas</Text>
      </View>

      {loading ? (
        <View style={s.loader}><ActivityIndicator size="large" color={palette.primary} /></View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Stats Row */}
          <View style={s.statsRow}>
            {[
              { value: `${current.toFixed(1)}`, unit: 'kg', label: 'PESO ACTUAL',
                color: palette.primary },
              { value: `${totalChange > 0 ? '+' : ''}${totalChange.toFixed(1)}`, unit: 'kg', label: 'CAMBIO',
                color: totalChange < 0 ? palette.success : totalChange > 0 ? palette.danger : palette.textPrimary },
              { value: `${progress.length}`, unit: 'sem', label: 'REGISTROS',
                color: palette.textPrimary },
            ].map(stat => (
              <View key={stat.label} style={[s.statCard, { backgroundColor: palette.bgCard, borderColor: palette.border }]}>
                <Text style={[s.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={[s.statUnit, { color: palette.textMuted }]}>{stat.unit}</Text>
                <Text style={[s.statLabel, { color: palette.textMuted }]}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Chart */}
          <View style={[s.chartCard, { backgroundColor: palette.bgCard, borderColor: palette.border }]}>
            <Text style={[s.chartTitle, { color: palette.textMuted }]}>EVOLUCIÓN</Text>
            <View style={s.chartInner}>
              {[...progress].reverse().map((p, i) => {
                const isLatest = i === progress.length - 1;
                return (
                  <View key={p.id} style={s.barCol}>
                    <View
                      style={[
                        s.bar,
                        { height: barH(p.peso) },
                        isLatest
                          ? { backgroundColor: palette.primary }
                          : { backgroundColor: palette.bgElevated, borderWidth: 0.5, borderColor: palette.border },
                      ]}
                    />
                    <Text style={[s.barLabel, { color: isLatest ? palette.primary : palette.textMuted }]}>
                      {p.peso.toFixed(0)}
                    </Text>
                  </View>
                );
              })}
            </View>
            {/* Legend */}
            <View style={s.legend}>
              <View style={[s.legendDot, { backgroundColor: palette.primary }]} />
              <Text style={[s.legendText, { color: palette.textSecondary }]}>Más reciente</Text>
              <View style={[s.legendDot, { backgroundColor: palette.bgElevated, marginLeft: 10, borderWidth: 0.5, borderColor: palette.border }]} />
              <Text style={[s.legendText, { color: palette.textSecondary }]}>Anteriores</Text>
            </View>
          </View>

          {/* Historial */}
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={[s.sectionTitle, { color: palette.textMuted }]}>HISTORIAL</Text>
            {progress.map((p, i) => {
              const prevW  = progress[i + 1]?.peso;
              const change = prevW ? (p.peso - prevW) : 0;
              const isDown = change < 0;
              return (
                <View
                  key={p.id}
                  style={[
                    s.histRow,
                    i < progress.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: palette.border },
                  ]}
                >
                  <View style={[s.histIconWrap, { backgroundColor: palette.bgCard, borderColor: palette.border }]}>
                    <IconSymbol size={16} name="clock.fill" color={palette.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.histDate, { color: palette.textPrimary }]}>{fmtDate(p.fecha)}</Text>
                    {p.notas && <Text style={[s.histNote, { color: palette.textMuted }]}>{p.notas}</Text>}
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <Text style={[s.histWeight, { color: palette.textPrimary }]}>
                      {p.peso.toFixed(1)}&thinsp;<Text style={{ fontSize: 12, color: palette.textMuted }}>kg</Text>
                    </Text>
                    {prevW !== undefined && change !== 0 && (
                      <Text style={[s.histDelta, { color: isDown ? palette.success : palette.danger }]}>
                        {change > 0 ? '+' : ''}{change.toFixed(1)} kg
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  header:    { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20 },
  title:     { fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  subtitle:  { fontSize: 13, marginTop: 4 },
  loader:    { flex: 1, justifyContent: 'center', alignItems: 'center' },

  statsRow:  { flexDirection: 'row', marginHorizontal: 20, gap: 8, marginTop: 20, marginBottom: 20 },
  statCard:  { flex: 1, borderRadius: 14, paddingVertical: 18, alignItems: 'center', borderWidth: 0.5 },
  statValue: { fontSize: 22, fontWeight: '800', marginBottom: 2 },
  statUnit:  { fontSize: 10, fontWeight: '600', marginBottom: 4 },
  statLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },

  chartCard:  { marginHorizontal: 20, borderRadius: 16, padding: 18, marginBottom: 24, borderWidth: 0.5 },
  chartTitle: { fontSize: 9, fontWeight: '700', letterSpacing: 1.5, marginBottom: 16 },
  chartInner: { flexDirection: 'row', height: 96, alignItems: 'flex-end', justifyContent: 'space-around', marginBottom: 10 },
  barCol:     { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar:        { width: 22, borderRadius: 5, marginBottom: 6 },
  barLabel:   { fontSize: 9, fontWeight: '600' },
  legend:     { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot:  { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11 },

  sectionTitle:  { fontSize: 9, fontWeight: '700', letterSpacing: 1.5, marginBottom: 14 },
  histRow:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 12 },
  histIconWrap:  { width: 38, height: 38, borderRadius: 10, borderWidth: 0.5, justifyContent: 'center', alignItems: 'center' },
  histDate:      { fontSize: 13, fontWeight: '600', marginBottom: 2 },
  histNote:      { fontSize: 11 },
  histWeight:    { fontSize: 22, fontWeight: '700' },
  histDelta:     { fontSize: 11, fontWeight: '700' },
});
