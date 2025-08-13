import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../auth/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('admin@avantsoft.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signIn(email, password);
    } catch (e: any) {
      Alert.alert('Erro', e?.response?.data?.error || e?.message || 'Falha ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} autoCapitalize="none" value={email} onChangeText={setEmail} placeholder="Email" />
      <TextInput style={styles.input} secureTextEntry value={password} onChangeText={setPassword} placeholder="Senha" />
      <Button title={loading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} disabled={loading} />
      <Text style={styles.hint}>Dica: admin@avantsoft.com / 123456</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 8 },
  hint: { marginTop: 10, textAlign: 'center', color: '#888' },
});
