import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import 'react-native-reanimated';

const API_BASE = 'http://10.0.2.2:3000';

interface Progreso {
  id: number;
  fecha: string;
  peso: number;
  notas: string | null;
}

// Datos de ejemplo
const DEFAULT_PROGRESS: Progreso[] = [
  { id: 1, fecha: '2024-01-29', peso: 77.9, notas: 'Casi en meta' },
  { id: 2, fecha: '2024-01-22', peso: 78.5, notas: 'Metiendo más cardio' },
  { id: 3, fecha: '2024-01-15', peso: 79.2, notas: 'Buen progreso' },
  { id: 4, fecha: '2024-01-08', peso: 79.8, notas: 'Primera semana completada' },
  { id: 5, fecha: '2024-01-01', peso: 80.5, notas: 'Inicio del programa' },
];

export default function ProgressScreen() {
  const [progress, setProgress] = useState<Progreso[]>(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/progreso`, {
        signal: AbortSignal.timeout(5000),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setProgress(data);
        }
      }
    } catch (e) {
      console.log('Error, usando datos por defecto');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getWeightChange = (current: number, previous: number) => {
    const change = current - previous;
    const prefix = change > 0 ? '+' : '';
    return `${prefix}${change.toFixed(1)} kg`;
  };

  const getWeightChangeColor = (change: number) => {
    if (change < 0) return '#4CAF50';
    if (change > 0) return '#FF6B6B';
    return '#A0A0A0';
  };

  // Calcular stats
  const currentWeight = progress[0]?.peso || 0;
  const initialWeight = progress[progress.length - 1]?.peso || currentWeight;
  const totalChange = currentWeight - initialWeight;
  const weeks = progress.length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      {/* Header */}
      <View style={styles.header}>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </Link>
        <Text style={styles.title}>Progreso</Text>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Stats Overview */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{currentWeight.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Peso Actual (kg)</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: totalChange < 0 ? '#4CAF50' : '#FF6B6B' }]}>
                {totalChange > 0 ? '+' : ''}{totalChange.toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>Cambio Total (kg)</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{weeks}</Text>
              <Text style={styles.statLabel}>Semanas</Text>
            </View>
          </View>

          {/* Progress Chart Placeholder */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Peso a lo Largo del Tiempo</Text>
            <View style={styles.chart}>
              {progress.map((p, index) => {
                const weights = progress.map(x => x.peso);
                const minWeight = Math.min(...weights);
                const maxWeight = Math.max(...weights);
                const range = maxWeight - minWeight || 1;
                const height = ((p.peso - minWeight) / range) * 100;
                
                return (
                  <View key={p.id} style={styles.chartBar}>
                    <View style={[styles.bar, { height: `${height}%` }]} />
                  </View>
                );
              })}
            </View>
          </View>

          {/* Historial */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Historial</Text>
            {progress.map((p, index) => {
              const previousWeight = progress[index + 1]?.peso;
              const change = previousWeight ? p.peso - previousWeight : 0;
              
              return (
                <View key={p.id} style={styles.progressItem}>
                  <View style={styles.progressDate}>
                    <Text style={styles.dateText}>{formatDate(p.fecha)}</Text>
                    {index < progress.length - 1 && (
                      <View style={styles.changeBadge}>
                        <Text style={[styles.changeText, { color: getWeightChangeColor(change) }]}>
                          {change !== 0 ? getWeightChange(p.peso, previousWeight) : '-'}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.progressWeight}>
                    <Text style={styles.weightValue}>{p.peso.toFixed(1)}</Text>
                    <Text style={styles.weightUnit}>kg</Text>
                  </View>
                  {p.notas && (
                    <Text style={styles.progressNotes}>{p.notas}</Text>
                  )}
                </View>
              );
            })}
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2A2A3D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 44,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E1E2D',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#A0A0A0',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  chartContainer: {
    marginHorizontal: 20,
    backgroundColor: '#1E1E2D',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  chartTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    height: 100,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  chartBar: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 24,
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    minHeight: 10,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  progressItem: {
    backgroundColor: '#1E1E2D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  progressDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  changeBadge: {
    backgroundColor: '#2A2A3D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressWeight: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  weightValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  weightUnit: {
    color: '#A0A0A0',
    fontSize: 16,
    marginLeft: 4,
  },
  progressNotes: {
    color: '#A0A0A0',
    fontSize: 12,
    fontStyle: 'italic',
  },
  bottomSpacing: {
    height: 100,
  },
});