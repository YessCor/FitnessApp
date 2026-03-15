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
import { Link, useLocalSearchParams } from 'expo-router';
import 'react-native-reanimated';

const API_BASE = 'http://10.0.2.2:3000';

interface EjercicioPlan {
  id: number;
  series: number;
  repeticiones: number;
  ejercicio: {
    id: number;
    nombre: string;
    grupoMuscular: string;
    descripcion: string | null;
  };
}

interface PlanEntrenamiento {
  id: number;
  nombre: string;
  nivel: string;
  duracionSemanas: number;
  ejerciciosPlan: EjercicioPlan[];
}

// Datos de ejemplo
const DEFAULT_PLAN: PlanEntrenamiento = {
  id: 1,
  nombre: 'Plan Principiante',
  nivel: 'Básico',
  duracionSemanas: 4,
  ejerciciosPlan: [
    { id: 1, series: 3, repeticiones: 12, ejercicio: { id: 1, nombre: 'Press de Banca', grupoMuscular: 'Pecho', descripcion: 'Ejercicio para pectorales' } },
    { id: 2, series: 3, repeticiones: 15, ejercicio: { id: 2, nombre: 'Sentadillas', grupoMuscular: 'Piernas', descripcion: 'Ejercicio para cuadriceps' } },
    { id: 3, series: 3, repeticiones: 10, ejercicio: { id: 3, nombre: 'Peso Muerto', grupoMuscular: 'Espalda', descripcion: 'Ejercicio para espalda' } },
    { id: 4, series: 4, repeticiones: 12, ejercicio: { id: 4, nombre: 'Press Militar', grupoMuscular: 'Hombros', descripcion: 'Ejercicio para hombros' } },
  ],
};

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams();
  const [plan, setPlan] = useState<PlanEntrenamiento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlan();
  }, [id]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const planId = id as string;
      
      // Intentar obtener de la API
      const response = await fetch(`${API_BASE}/planes/${planId}`, {
        signal: AbortSignal.timeout(5000),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.ejerciciosPlan) {
          setPlan(data);
        } else {
          // Si la API no devuelve ejerciciosPlan, usar datos por defecto
          setPlan({ ...DEFAULT_PLAN, id: parseInt(planId), nombre: data.nombre || DEFAULT_PLAN.nombre });
        }
      } else {
        setPlan(DEFAULT_PLAN);
      }
    } catch (e) {
      console.log('Error, usando datos por defecto');
      setPlan(DEFAULT_PLAN);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (!plan) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Plan no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
          </Link>
          <Text style={styles.title}>Detalle del Plan</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Info del Plan */}
        <View style={styles.planInfo}>
          <Text style={styles.planName}>{plan.nombre}</Text>
          <View style={styles.planMeta}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{plan.nivel}</Text>
            </View>
            <Text style={styles.duration}>{plan.duracionSemanas} semanas</Text>
          </View>
        </View>

        {/* Ejercicios del Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ejercicios</Text>
          {plan.ejerciciosPlan.map((ep, index) => (
            <View key={ep.id} style={styles.exerciseItem}>
              <View style={styles.exerciseNumber}>
                <Text style={styles.exerciseNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.exerciseDetails}>
                <Text style={styles.exerciseName}>{ep.ejercicio.nombre}</Text>
                <Text style={styles.exerciseMuscle}>{ep.ejercicio.grupoMuscular}</Text>
                {ep.ejercicio.descripcion && (
                  <Text style={styles.exerciseDesc}>{ep.ejercicio.descripcion}</Text>
                )}
              </View>
              <View style={styles.seriesReps}>
                <View style={styles.seriesRepsItem}>
                  <Text style={styles.seriesRepsValue}>{ep.series}</Text>
                  <Text style={styles.seriesRepsLabel}>series</Text>
                </View>
                <View style={styles.seriesRepsItem}>
                  <Text style={styles.seriesRepsValue}>{ep.repeticiones}</Text>
                  <Text style={styles.seriesRepsLabel}>reps</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    backgroundColor: '#121212',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 44,
  },
  planInfo: {
    marginHorizontal: 20,
    backgroundColor: '#6C63FF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  planMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  duration: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
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
  exerciseItem: {
    backgroundColor: '#1E1E2D',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  exerciseMuscle: {
    color: '#6C63FF',
    fontSize: 12,
    marginBottom: 4,
  },
  exerciseDesc: {
    color: '#A0A0A0',
    fontSize: 12,
  },
  seriesReps: {
    flexDirection: 'row',
    gap: 16,
  },
  seriesRepsItem: {
    alignItems: 'center',
    backgroundColor: '#2A2A3D',
    borderRadius: 12,
    padding: 12,
    minWidth: 50,
  },
  seriesRepsValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  seriesRepsLabel: {
    color: '#A0A0A0',
    fontSize: 10,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  bottomSpacing: {
    height: 100,
  },
});