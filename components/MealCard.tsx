import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MealCardProps {
  name: string;
  calories: number;
}

export default function MealCard({ name, calories }: MealCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🍽️</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.caloriesContainer}>
          <Text style={styles.calories}>{calories}</Text>
          <Text style={styles.caloriesLabel}>kcal</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E2D',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 140,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A3D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  calories: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  caloriesLabel: {
    color: '#A0A0A0',
    fontSize: 10,
    marginLeft: 2,
  },
});