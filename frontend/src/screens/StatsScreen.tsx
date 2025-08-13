import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { api } from '../api';
import { LineChart } from 'react-native-chart-kit';

type Daily = { date: string; total: number };
type TopsResponse = {
  topVolume: { client: any; total: number } | null;
  topAvgValue: { client: any; avg: number } | null;
  topUniqueDays: { client: any; uniqueDays: number } | null;
};

export default function StatsScreen() {
  const [daily, setDaily] = useState<Daily[]>([]);
  const [tops, setTops] = useState<TopsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [d, t] = await Promise.all([ api.get('/stats/daily-sales'), api.get('/stats/tops') ]);
      setDaily(d.data || []);
      setTops(t.data || null);
    } catch (e) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const width = Dimensions.get('window').width - 32;
  const labels = daily.map(d => d.date.slice(5));
  const dataVals = daily.map(d => Number(d.total || 0));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Estatísticas</Text>
      {loading && <ActivityIndicator />}

      {daily.length > 0 ? (
        <View style={styles.chartWrap}>
          <Text style={styles.section}>Total de vendas por dia</Text>
          <LineChart
            data={{ labels, datasets: [{ data: dataVals }] }}
            width={width}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity=1) => `rgba(33, 150, 243, ${opacity})`,
              labelColor: (opacity=1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: { r: '3' },
            }}
            bezier
            style={{ borderRadius: 12 }}
          />
        </View>
      ) : (
        <Text style={{ color: '#555' }}>Sem dados para o gráfico.</Text>
      )}

      <View style={{ height: 12 }} />

      <Text style={styles.section}>Destaques</Text>
      <View style={styles.cards}>
        <View style={[styles.card, styles.highlight]}>
          <Text style={styles.cardTitle}>Maior volume</Text>
          <Text style={styles.cardValue}>
            {tops?.topVolume?.client?.name || tops?.topVolume?.client?.nomeCompleto || '-'}
          </Text>
          <Text style={styles.cardSub}>Total R$ {tops?.topVolume ? tops.topVolume.total.toFixed(2) : '0.00'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Maior média por venda</Text>
          <Text style={styles.cardValue}>
            {tops?.topAvgValue?.client?.name || tops?.topAvgValue?.client?.nomeCompleto || '-'}
          </Text>
          <Text style={styles.cardSub}>Média R$ {tops?.topAvgValue ? tops.topAvgValue.avg.toFixed(2) : '0.00'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Maior frequência</Text>
          <Text style={styles.cardValue}>
            {tops?.topUniqueDays?.client?.name || tops?.topUniqueDays?.client?.nomeCompleto || '-'}
          </Text>
          <Text style={styles.cardSub}>Dias únicos: {tops?.topUniqueDays?.uniqueDays ?? 0}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: 'bold' },
  section: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  chartWrap: { backgroundColor: '#fff', borderRadius: 12, padding: 12, elevation: 2 },
  cards: { flexDirection: 'column', gap: 8 },
  card: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, elevation: 2 },
  highlight: { borderWidth: 1, borderColor: '#2196f3' },
  cardTitle: { fontWeight: '600', marginBottom: 4 },
  cardValue: { fontSize: 16, fontWeight: '700' },
  cardSub: { color: '#555', marginTop: 4 },
});
