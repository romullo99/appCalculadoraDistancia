import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getCalculations } from '../services/locationService';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getCalculations();
        setHistory(data);
      } catch (error) {
        console.error('Erro ao buscar histórico:', error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Pesquisas</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>CEP: {item.cep}</Text>
            <Text>Endereço: {item.address}</Text>
            <Text>Distância: {item.distance} km</Text>
            <Text>Data: {new Date(item.calculated_at).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
