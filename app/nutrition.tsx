import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import 'react-native-reanimated';

const API_BASE = 'http://10.0.2.2:3000';

interface Comida {
  id: number;
  nombre: string;
  calorias: number;
  proteina: number;
  carbohidratos: number;
  grasa: number;
}

interface PlanNutricion {
  id: number;
  nombre: string;
  objetivo: string;
  comidas: Comida[];
}

// Datos de ejemplo
const DEFAULT_PLANS: PlanNutricion[] = [
  {
    id: 1,
    nombre: 'Plan Perder Grasa',
    objetivo: 'perder_grasa',
    comidas: [
      { id: 1, nombre: 'Desayuno Proteico', calorias: 350, proteina: 30, carbohidratos: 25, grasa: 10 },
      { id: 2, nombre: 'Almuerzo Bajo en Carbs', calorias: 450, proteina: 40, carbohidratos: 30, grasa: 15 },
      { id: 3, nombre: 'Cena Ligera', calorias: 300, proteina: 35, carbohidratos: 20, grasa: 8 },
    ],
  },
  {
    id: 2,
    nombre: 'Plan Ganar Músculo',
    objetivo: 'ganar_musculo',
    comidas: [
      { id: 4, nombre: 'Desayuno Calórico', calorias: 600, proteina: 40, carbohidratos: 60, grasa: 20 },
      { id: 5, nombre: 'Almuerzo Hiperproteico', calorias: 700, proteina: 50, carbohidratos: 70, grasa: 25 },
      { id: 6, nombre: 'Cena Proteica', calorias: 550, proteina: 45, carbohidratos: 50, grasa: 18 },
    ],
  },
  {
    id: 3,
    nombre: 'Plan Mantenimiento',
    objetivo: 'mantenimiento',
    comidas: [
      { id: 7, nombre: 'Desayuno Balanceado', calorias: 450, proteina: 25, carbohidratos: 45, grasa: 15 },
      { id: 8, nombre: 'Almuerzo Equilibrado', calorias: 500, proteina: 30, carbohidratos: 50, grasa: 18 },
      { id: 9, nombre: 'Cena Moderada', calorias: 400, proteina: 28, carbohidratos: 40, grasa: 12 },
    ],
  },
];

const getObjectiveLabel = (objetivo: string): string => {
  switch (objetivo) {
    case 'perder_grasa': return '🔥 Perder Grasa';
    case 'ganar_musculo': return '💪 Ganar Músculo';
    case 'mantenimiento': return '⚖️ Mantenimiento';
    default: return objetivo;
  }
};

const getObjectiveColor = (objetivo: string): string => {
  switch (objetivo) {
    case 'perder_grasa': return '#FF6B6B';
    case 'ganar_musculo': return '#4CAF50';
    case 'mantenimiento': return '#6C63FF';
    default: return '#6C63FF';
  }
};

export default function NutritionScreen() {
  const [plans, setPlans] = useState<PlanNutricion[]>(DEFAULT_PLANS);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanNutricion | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/planes-nutricion`, {
        signal: AbortSignal.timeout(5000),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setPlans(data);
        }
      }
    } catch (e) {
      console.log('Error, usando datos por defecto');
    } finally {
      setLoading(false);
    }
  };

  const getTotalNutrients = (plan: PlanNutricion) => {
    let calories = 0, proteina = 0, carbohidratos = 0, grasa = 0;
    plan.comidas.forEach(c => {
      calories += c.calorias;
      proteina += c.proteina;
      carbohidratos += c.carbohidratos;
      grasa += c.grasa;
    });
    return { calories, proteina, carbohidratos, grasa };
  };

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
        <Text style={styles.title}>Nutrición</Text>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Planes Nutricionales */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Planes Nutricionales</Text>
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan?.id === plan.id && styles.planCardSelected,
                ]}
                onPress={() => setSelectedPlan(selectedPlan?.id === plan.id ? null : plan)}
              >
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.nombre}</Text>
                  <View style={[styles.objectiveBadge, { backgroundColor: getObjectiveColor(plan.objetivo) }]}>
                    <Text style={styles.objectiveText}>{getObjectiveLabel(plan.objetivo)}</Text>
                  </View>
                </View>
                
                {selectedPlan?.id === plan.id && (
                  <View style={styles.planDetails}>
                    {/* Totales */}
                    <View style={styles.totalsContainer}>
                      {(() => {
                        const totals = getTotalNutrients(plan);
                        return (
                          <>
                            <View style={styles.totalItem}>
                              <Text style={styles.totalValue}>{totals.calories}</Text>
                              <Text style={styles.totalLabel}>Kcal</Text>
                            </View>
                            <View style={styles.totalItem}>
                              <Text style={styles.totalValue}>{totals.proteina}g</Text>
                              <Text style={styles.totalLabel}>Proteína</Text>
                            </View>
                            <View style={styles.totalItem}>
                              <Text style={styles.totalValue}>{totals.carbohidratos}g</Text>
                              <Text style={styles.totalLabel}>Carbs</Text>
                            </View>
                            <View style={styles.totalItem}>
                              <Text style={styles.totalValue}>{totals.grasa}g</Text>
                              <Text style={styles.totalLabel}>Grasa</Text>
                            </View>
                          </>
                        );
                      })()}
                    </View>

                    {/* Comidas del plan */}
                    <Text style={styles.mealsTitle}>Comidas del Plan</Text>
                    {plan.comidas.map((comida, index) => (
                      <View key={index} style={styles.mealItem}>
                        <View style={styles.mealIcon}>
                          <Text style={styles.mealIconText}>🍽️</Text>
                        </View>
                        <View style={styles.mealInfo}>
                          <Text style={styles.mealName}>{comida.nombre}</Text>
                          <Text style={styles.mealNutrients}>
                            {comida.calorias} kcal • {comida.proteina}g P • {comida.carbohidratos}g C • {comida.grasa}g G
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}
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
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#1E1E2D',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  planCardSelected: {
    borderColor: '#6C63FF',
    borderWidth: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  objectiveBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  objectiveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  planDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2A2A3D',
  },
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalItem: {
    backgroundColor: '#2A2A3D',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  totalValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalLabel: {
    color: '#A0A0A0',
    fontSize: 10,
    marginTop: 2,
  },
  mealsTitle: {
    color: '#A0A0A0',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A3D',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  mealIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3A3A4D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mealIconText: {
    fontSize: 20,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  mealNutrients: {
    color: '#A0A0A0',
    fontSize: 12,
  },
  bottomSpacing: {
    height: 100,
  },
});