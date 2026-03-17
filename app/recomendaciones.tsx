import { useAppTheme } from '@/hooks/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

const API_BASE = 'http://10.0.2.2:3000';

interface Recomendaciones {
  imc: number;
  categoria: string;
  recomendacion_entrenamiento: string;
  recomendacion_nutricion: string;
  peso: number;
  estatura: number;
  edad: number | null;
}

export default function RecomendacionesScreen() {
  const { palette, isDark } = useAppTheme();
  const { token } = useAuth();
  const [recomendaciones, setRecomendaciones] = useState<Recomendaciones | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { 
    if (token) fetchRecomendaciones(); 
  }, [token]);

  const fetchRecomendaciones = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/recomendaciones`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setRecomendaciones(data);
      }
    } catch (error) {
      console.error('Error fetching recomendaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRecomendaciones();
    setRefreshing(false);
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'Bajo peso': return palette.warning;
      case 'Peso normal': return palette.success;
      case 'Sobrepeso': return palette.danger;
      case 'Obesidad': return palette.danger;
      default: return palette.textSecondary;
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.bgDeep, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  if (!recomendaciones) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.bgDeep, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: palette.textSecondary, textAlign: 'center' }}>
          Completa tu perfil físico para ver recomendaciones personalizadas
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: palette.bgDeep }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={palette.bgDeep} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: palette.border, borderBottomWidth: 0.5 }]}>
        <Text style={[styles.title, { color: palette.textPrimary }]}>Recomendaciones</Text>
        <Text style={[styles.subtitle, { color: palette.textSecondary }]}>Personalizadas para ti</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={palette.primary} />}
      >
        {/* IMC Card */}
        <View style={[styles.imcCard, { backgroundColor: palette.bgCard, borderColor: palette.border }]}>
          <Text style={[styles.imcLabel, { color: palette.textSecondary }]}>TU ÍNDICE DE MASA CORPORAL</Text>
          <View style={styles.imcRow}>
            <Text style={[styles.imcValue, { color: getCategoriaColor(recomendaciones.categoria) }]}>
              {recomendaciones.imc}
            </Text>
            <View style={[styles.categoriaBadge, { backgroundColor: getCategoriaColor(recomendaciones.categoria) + '20' }]}>
              <Text style={[styles.categoriaText, { color: getCategoriaColor(recomendaciones.categoria) }]}>
                {recomendaciones.categoria}
              </Text>
            </View>
          </View>
          
          {/* Datos adicionales */}
          <View style={styles.datosRow}>
            <View style={styles.datoItem}>
              <Text style={[styles.datoValue, { color: palette.textPrimary }]}>{recomendaciones.peso} kg</Text>
              <Text style={[styles.datoLabel, { color: palette.textMuted }]}>Peso</Text>
            </View>
            <View style={[styles.datoDivider, { backgroundColor: palette.border }]} />
            <View style={styles.datoItem}>
              <Text style={[styles.datoValue, { color: palette.textPrimary }]}>{recomendaciones.estatura} cm</Text>
              <Text style={[styles.datoLabel, { color: palette.textMuted }]}>Estatura</Text>
            </View>
            {recomendaciones.edad && (
              <>
                <View style={[styles.datoDivider, { backgroundColor: palette.border }]} />
                <View style={styles.datoItem}>
                  <Text style={[styles.datoValue, { color: palette.textPrimary }]}>{recomendaciones.edad} años</Text>
                  <Text style={[styles.datoLabel, { color: palette.textMuted }]}>Edad</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Recomendación de Entrenamiento */}
        <View style={[styles.recCard, { backgroundColor: palette.bgCard, borderColor: palette.border }]}>
          <View style={styles.recHeader}>
            <Text style={[styles.recIcon]}>💪</Text>
            <Text style={[styles.recTitle, { color: palette.textPrimary }]}>Entrenamiento</Text>
          </View>
          <Text style={[styles.recText, { color: palette.textSecondary }]}>
            {recomendaciones.recomendacion_entrenamiento}
          </Text>
        </View>

        {/* Recomendación de Nutrición */}
        <View style={[styles.recCard, { backgroundColor: palette.bgCard, borderColor: palette.border }]}>
          <View style={styles.recHeader}>
            <Text style={[styles.recIcon]}>🥗</Text>
            <Text style={[styles.recTitle, { color: palette.textPrimary }]}>Nutrición</Text>
          </View>
          <Text style={[styles.recText, { color: palette.textSecondary }]}>
            {recomendaciones.recomendacion_nutricion}
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20 },
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 4 },
  
  imcCard: { margin: 20, borderRadius: 16, padding: 20, borderWidth: 0.5 },
  imcLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 },
  imcRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  imcValue: { fontSize: 48, fontWeight: '800' },
  categoriaBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  categoriaText: { fontSize: 12, fontWeight: '700' },
  
  datosRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  datoItem: { alignItems: 'center', flex: 1 },
  datoValue: { fontSize: 16, fontWeight: '700' },
  datoLabel: { fontSize: 11, marginTop: 4 },
  datoDivider: { width: 1, height: 30 },
  
  recCard: { marginHorizontal: 20, marginBottom: 16, borderRadius: 16, padding: 20, borderWidth: 0.5 },
  recHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  recIcon: { fontSize: 20, marginRight: 8 },
  recTitle: { fontSize: 16, fontWeight: '700' },
  recText: { fontSize: 14, lineHeight: 22 },
});
