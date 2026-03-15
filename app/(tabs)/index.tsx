import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Link } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

// URL base de la API
const API_BASE = 'http://10.0.2.2:3000';

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

// Datos de ejemplo por defecto
const DEFAULT_PLANS: Plan[] = [
  { id: 1, nombre: 'Plan Principiante', nivel: 'Básico', duracion_semanas: 4 },
  { id: 2, nombre: 'Plan Intermedio', nivel: 'Medio', duracion_semanas: 8 },
  { id: 3, nombre: 'Plan Avanzado', nivel: 'Experto', duracion_semanas: 12 },
];

const DEFAULT_EXERCISES: Exercise[] = [
  { id: 1, nombre: 'Press de Banca', grupo_muscular: 'Pecho' },
  { id: 2, nombre: 'Sentadillas', grupo_muscular: 'Piernas' },
  { id: 3, nombre: 'Peso Muerto', grupo_muscular: 'Espalda' },
];

const DEFAULT_MEALS: Meal[] = [
  { id: 1, nombre: 'Desayuno Proteico', calorias: 450 },
  { id: 2, nombre: 'Almuerzo Balanceado', calorias: 650 },
  { id: 3, nombre: 'Cena Ligera', calorias: 350 },
];

// Recomendaciones estáticas
const RECOMMENDATIONS = [
  {
    id: 1,
    title: 'Hidratación',
    description: 'Bebe al menos 2 litros de agua al día',
    icon: '💧',
  },
  {
    id: 2,
    title: 'Descanso',
    description: 'Duerme entre 7-8 horas para recuperarte',
    icon: '😴',
  },
  {
    id: 3,
    title: 'Calentamiento',
    description: 'Siempre haz calentamiento antes de entrenar',
    icon: '🔥',
  },
];

export default function HomeScreen() {
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_PLANS);
  const [exercises, setExercises] = useState<Exercise[]>(DEFAULT_EXERCISES);
  const [meals, setMeals] = useState<Meal[]>(DEFAULT_MEALS);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch planes
      try {
        const plansResponse = await fetch(`${API_BASE}/planes`, {
          signal: AbortSignal.timeout(5000),
        });
        if (plansResponse.ok) {
          const plansData = await plansResponse.json();
          if (plansData.length > 0) {
            setPlans(plansData);
          }
        }
      } catch (e) {
        console.log('Planes: usando datos por defecto');
      }
      
      // Fetch ejercicios
      try {
        const exercisesResponse = await fetch(`${API_BASE}/ejercicios`, {
          signal: AbortSignal.timeout(5000),
        });
        if (exercisesResponse.ok) {
          const exercisesData = await exercisesResponse.json();
          if (exercisesData.length > 0) {
            setExercises(exercisesData);
          }
        }
      } catch (e) {
        console.log('Ejercicios: usando datos por defecto');
      }
      
      // Fetch comidas
      try {
        const mealsResponse = await fetch(`${API_BASE}/comidas`, {
          signal: AbortSignal.timeout(5000),
        });
        if (mealsResponse.ok) {
          const mealsData = await mealsResponse.json();
          if (mealsData.length > 0) {
            setMeals(mealsData);
          }
        }
      } catch (e) {
        console.log('Comidas: usando datos por defecto');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado con menú */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Fitness App</Text>
            <Text style={styles.subtitle}>Bienvenido</Text>
          </View>
          <Link href="/exercises" asChild>
            <TouchableOpacity style={styles.menuButton}>
              <IconSymbol size={24} name="list.bullet" color="#FFFFFF" />
            </TouchableOpacity>
          </Link>
        </View>

        {/* Banner de Bienvenida */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.welcomeTitle}>¡Comienza tu transformación!</Text>
          <Text style={styles.welcomeText}>
            Mantén la consistencia y alcanzarás tus metas
          </Text>
        </View>

        {/* Recomendaciones del Día */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recomendaciones del Día</Text>
          {RECOMMENDATIONS.map((rec) => (
            <View key={rec.id} style={styles.recommendationCard}>
              <Text style={styles.recIcon}>{rec.icon}</Text>
              <View style={styles.recContent}>
                <Text style={styles.recTitle}>{rec.title}</Text>
                <Text style={styles.recDescription}>{rec.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Botones de Navegación */}
        <View style={styles.navButtons}>
          <Link href="/nutrition" asChild>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navIcon}>🥗</Text>
              <Text style={styles.navText}>Nutrición</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/progress" asChild>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navIcon}>📊</Text>
              <Text style={styles.navText}>Progreso</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Información de Estado Físico */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Días Seguidos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Ejercicios</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>1,450</Text>
            <Text style={styles.statLabel}>Kcal Hoy</Text>
          </View>
        </View>

        {/* Sección Planes de Entrenamiento */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Planes de Entrenamiento</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {plans.map((plan) => (
              <Link key={plan.id} href={`/plan/${plan.id}`} asChild>
                <TouchableOpacity style={styles.planCard}>
                  <Text style={styles.planName}>{plan.nombre}</Text>
                  <View style={styles.planInfo}>
                    <View style={styles.planBadge}>
                      <Text style={styles.planBadgeText}>{plan.nivel}</Text>
                    </View>
                    <Text style={styles.planDuration}>{plan.duracion_semanas} sem</Text>
                  </View>
                </TouchableOpacity>
              </Link>
            ))}
          </ScrollView>
        </View>

        {/* Sección Ejercicios Populares */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ejercicios Populares</Text>
            <Link href="/exercises">
              <Text style={styles.seeAll}>Ver todos →</Text>
            </Link>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {exercises.map((exercise) => (
              <View key={exercise.id} style={styles.exerciseCard}>
                <View style={styles.exerciseIcon}>
                  <Text style={styles.exerciseIconText}>🏋️</Text>
                </View>
                <Text style={styles.exerciseName}>{exercise.nombre}</Text>
                <Text style={styles.exerciseMuscle}>{exercise.grupo_muscular}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Sección Nutrición */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nutrición</Text>
            <Link href="/nutrition">
              <Text style={styles.seeAll}>Ver todos →</Text>
            </Link>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {meals.map((meal) => (
              <View key={meal.id} style={styles.mealCard}>
                <View style={styles.mealIcon}>
                  <Text style={styles.mealIconText}>🍽️</Text>
                </View>
                <Text style={styles.mealName}>{meal.nombre}</Text>
                <Text style={styles.mealCalories}>{meal.calorias} kcal</Text>
              </View>
            ))}
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeBanner: {
    marginHorizontal: 20,
    backgroundColor: '#6C63FF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    marginHorizontal: 20,
  },
  seeAll: {
    color: '#6C63FF',
    fontSize: 14,
    marginBottom: 16,
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: '#1E1E2D',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  recIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  recContent: {
    flex: 1,
  },
  recTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recDescription: {
    color: '#A0A0A0',
    fontSize: 13,
  },
  navButtons: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#1E1E2D',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    gap: 12,
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
  },
  horizontalScroll: {
    paddingHorizontal: 20,
  },
  planCard: {
    backgroundColor: '#1E1E2D',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 150,
  },
  planName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  planInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planBadge: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  planBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  planDuration: {
    color: '#A0A0A0',
    fontSize: 12,
  },
  exerciseCard: {
    backgroundColor: '#1E1E2D',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 120,
    alignItems: 'center',
  },
  exerciseIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2A2A3D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseIconText: {
    fontSize: 24,
  },
  exerciseName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  exerciseMuscle: {
    color: '#A0A0A0',
    fontSize: 11,
  },
  mealCard: {
    backgroundColor: '#1E1E2D',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 120,
    alignItems: 'center',
  },
  mealIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2A2A3D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealIconText: {
    fontSize: 24,
  },
  mealName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  mealCalories: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
});
