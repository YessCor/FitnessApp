import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Link } from 'expo-router';

// URL base de la API
const API_BASE = 'http://10.0.2.2:3000';

interface Exercise {
  id: number;
  nombre: string;
  grupo_muscular: string;
  descripcion?: string;
}

// Datos de ejemplo
const DEFAULT_EXERCISES: Exercise[] = [
  { id: 1, nombre: 'Press de Banca', grupo_muscular: 'Pecho', descripcion: 'Ejercicio para pectorales' },
  { id: 2, nombre: 'Sentadillas', grupo_muscular: 'Piernas', descripción: 'Ejercicio para cuadriceps y gluteos' },
  { id: 3, nombre: 'Peso Muerto', grupo_muscular: 'Espalda', descripcion: 'Ejercicio para espalda baja' },
  { id: 4, nombre: 'Press Militar', grupo_muscular: 'Hombros', descripcion: 'Ejercicio para hombros' },
  { id: 5, nombre: 'Dominadas', grupo_muscular: 'Espalda', descripcion: 'Ejercicio para espalda y biceps' },
  { id: 6, nombre: 'curl de biceps', grupo_muscular: 'Brazos', descripcion: 'Ejercicio para biceps' },
  { id: 7, nombre: 'Extensiones', grupo_muscular: 'Triceps', descripcion: 'Ejercicio para triceps' },
  { id: 8, nombre: 'Crunches', grupo_muscular: 'Abdomen', descripcion: 'Ejercicio para abdomen' },
];

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>(DEFAULT_EXERCISES);
  const [loading, setLoading] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  const muscleGroups = ['Pecho', 'Piernas', 'Espalda', 'Hombros', 'Brazos', 'Triceps', 'Abdomen'];

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/ejercicios`, {
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setExercises(data);
        }
      }
    } catch (e) {
      console.log('Usando ejercicios por defecto');
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = selectedMuscle
    ? exercises.filter(e => e.grupo_muscular === selectedMuscle)
    : exercises;

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
        <Text style={styles.title}>Ejercicios</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filtros */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        <TouchableOpacity
          style={[styles.filterChip, !selectedMuscle && styles.filterChipActive]}
          onPress={() => setSelectedMuscle(null)}
        >
          <Text style={[styles.filterText, !selectedMuscle && styles.filterTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>
        {muscleGroups.map((muscle) => (
          <TouchableOpacity
            key={muscle}
            style={[styles.filterChip, selectedMuscle === muscle && styles.filterChipActive]}
            onPress={() => setSelectedMuscle(muscle)}
          >
            <Text style={[styles.filterText, selectedMuscle === muscle && styles.filterTextActive]}>
              {muscle}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.exercisesGrid}>
          {filteredExercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseIcon}>
                <Text style={styles.exerciseIconText}>🏋️</Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.nombre}</Text>
                <View style={styles.muscleBadge}>
                  <Text style={styles.muscleText}>{exercise.grupo_muscular}</Text>
                </View>
              </View>
            </View>
          ))}
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
  filtersContainer: {
    maxHeight: 50,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2A2A3D',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#6C63FF',
  },
  filterText: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  exercisesGrid: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  exerciseCard: {
    backgroundColor: '#1E1E2D',
    borderRadius: 16,
    padding: 16,
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2A2A3D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseIconText: {
    fontSize: 24,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  muscleBadge: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  muscleText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
});