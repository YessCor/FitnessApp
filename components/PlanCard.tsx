import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PlanCardProps {
  name: string;
  level: string;
  durationWeeks: number;
}

export default function PlanCard({ name, level, durationWeeks }: PlanCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.infoRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{level}</Text>
        </View>
        <Text style={styles.duration}>{durationWeeks} semanas</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E2D',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  duration: {
    color: '#A0A0A0',
    fontSize: 12,
  },
});