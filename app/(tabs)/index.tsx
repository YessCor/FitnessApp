import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ExerciseCard from '@/components/ExerciseCard';
import MealCard from '@/components/MealCard';
import PlanCard from '@/components/PlanCard';

// URL base de la API - cambia esto por tu IP local
const API_BASE = 'http://192.168.1.8:3000';

interface Plan {
  id: number;
  nombre: string;
  nivel: string;
  duracion_semanas: number;
}

interface Exercise {
  id: number;
  nombre: string;
  grupo_muscular: string;
}

interface Meal {
  id: number;
  nombre: string;
  calorias: number;
}

export default function HomeScreen() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch planes
      const plansResponse = await fetch(`${API_BASE}/planes`);
      const plansData = await plansResponse.json();
      setPlans(plansData);
      
      // Fetch ejercicios
      const exercisesResponse = await fetch(`${API_BASE}/ejercicios`);
      const exercisesData = await exercisesResponse.json();
      setExercises(exercisesData);
      
      // Fetch comidas
      const mealsResponse = await fetch(`${API_BASE}/comidas`);
      const mealsData = await mealsResponse.json();
      setMeals(mealsData);
      
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos. Verifica que la API esté corriendo.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>Fitness App</Text>
          <Text style={styles.subtitle}>Bienvenido</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Sección Planes de Entrenamiento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planes de Entrenamiento</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {plans.length > 0 ? (
              plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  name={plan.nombre}
                  level={plan.nivel}
                  durationWeeks={plan.duracion_semanas}
                />
              ))
            ) : (
              <Text style={styles.noDataText}>No hay planes disponibles</Text>
            )}
          </ScrollView>
        </View>

        {/* Sección Ejercicios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ejercicios</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {exercises.length > 0 ? (
              exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  name={exercise.nombre}
                  muscleGroup={exercise.grupo_muscular}
                />
              ))
            ) : (
              <Text style={styles.noDataText}>No hay ejercicios disponibles</Text>
            )}
          </ScrollView>
        </View>

        {/* Sección Nutrición */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrición</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {meals.length > 0 ? (
              meals.map((meal) => (
                <MealCard
                  key={meal.id}
                  name={meal.nombre}
                  calories={meal.calorias}
                />
              ))
            ) : (
              <Text style={styles.noDataText}>No hay comidas disponibles</Text>
            )}
          </ScrollView>
        </View>

        {/* Espaciado final */}
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
  loadingText: {
    color: '#A0A0A0',
    marginTop: 12,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#A0A0A0',
  },
  errorContainer: {
    backgroundColor: '#FF4444',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    marginHorizontal: 20,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  noDataText: {
    color: '#A0A0A0',
    fontSize: 14,
    fontStyle: 'italic',
  },
  bottomSpacing: {
    height: 100,
  },
});
