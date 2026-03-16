import { Tabs } from 'expo-router';
import React from 'react';
import FloatingTabBar from '@/components/FloatingTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // Prevent any default tab bar background bleed-through
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen name="index"     options={{ title: 'Inicio'     }} />
      <Tabs.Screen name="exercises" options={{ title: 'Ejercicios' }} />
      <Tabs.Screen name="nutrition" options={{ title: 'Nutrición'  }} />
      <Tabs.Screen name="progress"  options={{ title: 'Progreso'   }} />
    </Tabs>
  );
}
