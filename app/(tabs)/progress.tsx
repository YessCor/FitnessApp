import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, StatusBar, ActivityIndicator, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useAppTheme } from '@/hooks/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/hooks/useAuth';

const API_BASE = 'http://10.0.2.2:3000';

interface Progreso { id: number; fecha: string; peso: number; notas: string | null; estatura?: number | null; }

const DEFAULT_PROGRESS: Progreso[] = [];

export default function ProgressScreen() {
  const { palette, isDark } = useAppTheme();
  const { token, tienePerfilFisico } = useAuth();
  const [progress, setProgress] = useState<Progreso[]>(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPeso, setNewPeso] = useState('');
  const [newNotas, setNewNotas] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProgress(); }, [token]);

  const fetchProgress = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/progreso`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) { 
        const d = await res.json(); 
        if (d.length) setProgress(d); 
        else setProgress([]);
      }
    } catch {}
    finally { setLoading(false); }
  };

  const handleAddProgreso = async () => {
    if (!newPeso || !token) return;
    
    const pesoNum = parseFloat(newPeso);
    if (isNaN(pesoNum) || pesoNum < 30 || pesoNum > 300) {
      Alert.alert('Error', 'Por favor ingresa un peso válido');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/progreso`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          peso: pesoNum,
          notas: newNotas || null
        })
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewPeso('');
        setNewNotas('');
        fetchProgress();
      } else {
        const data = await res.json();
        Alert.alert('Error', data.error || 'Error al guardar');
      }
    } catch {
      Alert.alert('Error', 'Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  const fmtDate = (str: string) =>
    new Date(str).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

  const current     = progress[0]?.peso ?? 0;
  const initial     = progress[progress.length - 1]?.peso ?? current;
  const totalChange = current - initial;

  // Chart
  const weights = progress.map(p => p.peso);
  const minW    = weights.length > 0 ? Math.min(...weights) : 0;
  const maxW    = weights.length > 0 ? Math.max(...weights) : 1;
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

      {/* FAB for adding progress */}
      {token && tienePerfilFisico && (
        <TouchableOpacity
          style={[s.fab, { backgroundColor: palette.primary }]}
          onPress={() => setShowAddModal(true)}
        >
          <IconSymbol size={24} name="plus" color="#fff" />
        </TouchableOpacity>
      )}

      {/* Add Progress Modal */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={[s.modalContent, { backgroundColor: palette.bgCard }]}>
            <Text style={[s.modalTitle, { color: palette.textPrimary }]}>Registrar Peso</Text>
            
            <View style={s.inputGroup}>
              <Text style={[s.label, { color: palette.textSecondary }]}>Peso (kg)</Text>
              <TextInput
                style={[s.input, { backgroundColor: palette.bgDeep, borderColor: palette.border, color: palette.textPrimary }]}
                value={newPeso}
                onChangeText={setNewPeso}
                placeholder="70.5"
                placeholderTextColor={palette.textMuted}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={s.inputGroup}>
              <Text style={[s.label, { color: palette.textSecondary }]}>Notas (opcional)</Text>
              <TextInput
                style={[s.input, { backgroundColor: palette.bgDeep, borderColor: palette.border, color: palette.textPrimary, height: 80, textAlignVertical: 'top' }]}
                value={newNotas}
                onChangeText={setNewNotas}
                placeholder="¿Alguna nota sobre esta semana?"
                placeholderTextColor={palette.textMuted}
                multiline
              />
            </View>

            <View style={s.modalButtons}>
              <TouchableOpacity
                style={[s.modalButton, { backgroundColor: palette.bgDeep }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={{ color: palette.textPrimary }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.modalButton, { backgroundColor: palette.primary }]}
                onPress={handleAddProgreso}
                disabled={saving}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>{saving ? 'Guardando...' : 'Guardar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  // FAB
  fab: { position: 'absolute', right: 20, bottom: 30, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 400, borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { height: 48, borderRadius: 12, paddingHorizontal: 16, fontSize: 16, borderWidth: 1 },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalButton: { flex: 1, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
});
