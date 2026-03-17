import { useAppTheme } from '@/hooks/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const { palette } = useAppTheme();
  const { register } = useAuth();
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombre || !apellido || !email || !username || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      await register({ nombre, apellido, email, username, password });
      Alert.alert('Éxito', 'Usuario registrado correctamente. Por favor inicia sesión.', [
        { text: 'OK', onPress: () => router.replace('/login') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al registrar usuario');
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
          <Text style={[styles.title, { color: palette.textPrimary }]}>Crear Cuenta</Text>
          <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
            Únete a FitnessApp
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.label, { color: palette.textSecondary }]}>Nombre</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: palette.bgCard, 
                    borderColor: palette.border, 
                    color: palette.textPrimary 
                  }
                ]}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Juan"
                placeholderTextColor={palette.textMuted}
                autoCapitalize="words"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={[styles.label, { color: palette.textSecondary }]}>Apellido</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: palette.bgCard, 
                    borderColor: palette.border, 
                    color: palette.textPrimary 
                  }
                ]}
                value={apellido}
                onChangeText={setApellido}
                placeholder="Pérez"
                placeholderTextColor={palette.textMuted}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: palette.textSecondary }]}>Email</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: palette.bgCard, 
                  borderColor: palette.border, 
                  color: palette.textPrimary 
                }
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              placeholderTextColor={palette.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: palette.textSecondary }]}>Username</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: palette.bgCard, 
                  borderColor: palette.border, 
                  color: palette.textPrimary 
                }
              ]}
              value={username}
              onChangeText={setUsername}
              placeholder="juan123"
              placeholderTextColor={palette.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: palette.textSecondary }]}>Contraseña</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: palette.bgCard, 
                  borderColor: palette.border, 
                  color: palette.textPrimary 
                }
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={palette.textMuted}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: palette.primary }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.backButton, { borderColor: palette.border }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backButtonText, { color: palette.textSecondary }]}>
              ← Volver al Login
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
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
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
  backButton: {
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
