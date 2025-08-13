import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { api } from '../api';
import MissingLetterBadge from '../components/MissingLetterBadge';

type Client = {
  name: string;
  email?: string | null;
  birthdate?: string | null;
  vendas?: { data: string; valor: number }[];
};

function normalizeClientsResponse(raw: any): Client[] {
  try {
    const arr: any[] = raw?.data?.clientes || raw?.clientes || raw || [];
    return (arr as any[]).map((item) => {
      const info = item?.info || {};
      const detalhes = info?.detalhes || {};
      const dup = item?.duplicado || {};
      const estat = item?.estatisticas || {};

      const name = info?.nomeCompleto ?? dup?.nomeCompleto ?? item?.name ?? '';
      const email = detalhes?.email ?? item?.email ?? null;
      const birthdate = detalhes?.nascimento ?? item?.birthdate ?? null;
      const vendas = Array.isArray(estat?.vendas) ? estat.vendas : [];

      return { name, email, birthdate, vendas };
    });
  } catch {
    return [];
  }
}

export default function ClientsScreen() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get('/clients');
      console.log('fetchClientes res.data: ', res.data);
      setClients(normalizeClientsResponse(res.data));
    } catch (e: any) {
      Alert.alert('Erro', e?.response?.data?.error || 'Falha ao listar clientes');
    } finally {
      setLoading(false);
    }
  };

  const addClient = async () => {
    if (!name) return Alert.alert('Validação', 'Informe o nome');
    try {
      await api.post('/clients', { name, email: email || null, birthdate: birthdate || null });
      setName(''); setEmail(''); setBirthdate('');
      fetchClients();
    } catch (e: any) {
      Alert.alert('Erro', e?.response?.data?.error || 'Falha ao criar cliente');
    }
  };

  useEffect(() => { fetchClients(); }, []);

  const renderItem = ({ item }: { item: Client }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.name}>{item.name}</Text>
        <MissingLetterBadge name={item.name} />
      </View>
      {!!item.email && <Text style={styles.email}>{item.email}</Text>}
      {!!item.birthdate && <Text style={styles.birthdate}>Nascimento: {item.birthdate}</Text>}
      {Array.isArray(item.vendas) && item.vendas.length > 0 && (
        <Text style={styles.sales}>
          Vendas: {item.vendas.length} (total R$ {item.vendas.reduce((a, b) => a + (Number(b.valor)||0), 0).toFixed(2)})
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clientes</Text>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Nome completo" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Nascimento (YYYY-MM-DD)" value={birthdate} onChangeText={setBirthdate} />
        <Button title="Adicionar cliente" onPress={addClient} />
      </View>

      <FlatList
        data={clients}
        refreshing={loading}
        onRefresh={fetchClients}
        keyExtractor={(item, index) => `${item.email}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  form: { gap: 8, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 2 },
  name: { fontSize: 16, fontWeight: '600' },
  email: { color: '#555', marginTop: 2 },
  birthdate: { color: '#555', marginTop: 2 },
  sales: { color: '#333', marginTop: 6, fontWeight: '500' },
});
