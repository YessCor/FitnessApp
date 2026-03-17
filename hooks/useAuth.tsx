import React, { createContext, ReactNode, useContext, useState } from 'react';

const API_BASE = 'http://10.0.2.2:3000';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  fechaNacimiento?: string;
  rol: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  tienePerfilFisico: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkPerfilFisico: () => Promise<boolean>;
  refreshUsuario: () => Promise<void>;
}

interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  password: string;
  fecha_nacimiento?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tienePerfilFisico, setTienePerfilFisico] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkPerfilFisico = async (authToken?: string): Promise<boolean> => {
    const authTokenFinal = authToken || token;
    if (!authTokenFinal) return false;
    
    try {
      const res = await fetch(`${API_BASE}/perfil`, {
        headers: { Authorization: `Bearer ${authTokenFinal}` }
      });
      
      if (res.ok) {
        setTienePerfilFisico(true);
        return true;
      } else if (res.status === 404) {
        setTienePerfilFisico(false);
        return false;
      }
    } catch (error) {
      console.error('Error checking perfil:', error);
    }
    return false;
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      const { token: newToken, usuario: newUser, tienePerfilFisico: tienePerfil } = data;

      setToken(newToken);
      setUsuario(newUser);
      setTienePerfilFisico(tienePerfil);
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData: RegisterData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    setTienePerfilFisico(false);
  };

  const refreshUsuario = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setUsuario(data);
        setTienePerfilFisico(data.tienePerfilFisico);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      token,
      tienePerfilFisico,
      loading,
      login,
      register,
      logout,
      checkPerfilFisico,
      refreshUsuario
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
