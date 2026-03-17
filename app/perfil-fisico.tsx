import { useAppTheme } from '@/hooks/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const API_BASE = 'http://10.0.2.2:3000';

export default function PerfilFisicoScreen() {
  const { palette } = useAppTheme();
  const { token, checkPerfilFisico } = useAuth();
  const router = useRouter();

  const [peso, setPeso] = useState('');
  const [estatura, setEstatura] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const pesoNum = parseFloat(peso);
    const estaturaNum = parseFloat(estatura);

    if (!peso || !estatura) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (pesoNum < 30 || pesoNum > 300) {
      Alert.alert('Error', 'Por favor ingresa un peso válido (30-300 kg)');
      return;
    }

    if (estaturaNum < 100 || estaturaNum > 250) {
      Alert.alert('Error', 'Por favor ingresa una estatura válida (100-250 cm)');
      return;
    }

    try {
      setLoading(true);
      
      const res = await fetch(`${API_BASE}/perfil`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          peso: pesoNum,
          estatura: estaturaNum
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar perfil');
      }

      await checkPerfilFisico();
      Alert.alert('Éxito', 'Perfil guardado correctamente', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al guardar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: palette.bgDeep }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.title, { color: palette.textPrimary }]}>Tu Perfil Físico</Text>
          <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
            Necesitamos algunos datos para personalizar tu experiencia
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: palette.textSecondary }]}>Peso (kg)</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: palette.bgCard, 
                  borderColor: palette.border, 
                  color: palette.textPrimary 
                }
              ]}
              value={peso}
              onChangeText={setPeso}
              placeholder="70.5"
              placeholderTextColor={palette.textMuted}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: palette.textSecondary }]}>Estatura (cm)</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: palette.bgCard, 
                  borderColor: palette.border, 
                  color: palette.textPrimary 
                }
              ]}
              value={estatura}
              onChangeText={setEstatura}
              placeholder="175"
              placeholderTextColor={palette.textMuted}
              keyboardType="number-pad"
            />
          </View>

          <View style={[styles.infoCard, { backgroundColor: palette.bgCard, borderColor: palette.border }]}>
            <Text style={[styles.infoTitle, { color: palette.textPrimary }]}>¿Por qué necesitamos esto?</Text>
            <Text style={[styles.infoText, { color: palette.textSecondary }]}>
              Con estos datos calcularemos tu Índice de Masa Corporal (IMC) y te proporcionaremos recomendaciones personalizadas de entrenamiento y nutrición.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: palette.primary }]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Guardando...' : 'Continuar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
  },
  button: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
