import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { API } from '../config';
import { setAuthToken, setUnauthorizedHandler } from '../api';

type AuthContextType = {
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem('token');
      if (t) setToken(t);
    })();
  }, []);

  useEffect(() => {
    setAuthToken(token);
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // compat global
    else delete axios.defaults.headers.common['Authorization'];
  }, [token]);

  const signIn = async (email: string, password: string) => {
    const res = await axios.post(`${API.BASE_URL}/auth/login`, { email, password });
    const t = res.data?.token;
    if (!t) throw new Error('Token não recebido');
    setToken(t);
    setAuthToken(t);
    await AsyncStorage.setItem('token', t);
  };

  const signOut = async () => {
    setToken(null);
    setAuthToken(null);
    await AsyncStorage.removeItem('token');
  };

  
  // Handler global para 401: mostra toast e faz signOut
  useEffect(() => {
    setUnauthorizedHandler(() => {
      Toast.show({ type: 'error', text1: 'Sessão expirada', text2: 'Faça login novamente.' });
      // Não precisamos aguardar: o Root redireciona ao ver token = null
      signOut();
    });
    return () => setUnauthorizedHandler(undefined);
  }, []);

  return (
    <AuthContext.Provider value={{ token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
