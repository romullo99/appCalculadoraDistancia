import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { saveCalculation } from '../services/locationService';

export default function HomeScreen({ navigation }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapRegion, setMapRegion] = useState(null);

  const isValidCep = (cep) => /^[0-9]{8}$/.test(cep);

  const haversineDistance = (coords1, coords2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; 
    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lon - coords1.lon);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(coords1.lat)) * Math.cos(toRad(coords2.lat)) * Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Habilite o acesso à localização.');
        return;
      }

      setLoading(true);
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setCurrentLocation({ lat: latitude, lon: longitude });
      setLoading(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter sua localização.');
      setLoading(false);
    }
  };

  const fetchCepLocation = async () => {
    if (!isValidCep(cep)) {
      Alert.alert('Erro', 'Digite um CEP válido.');
      return;
    }
  
    if (!currentLocation) {
      Alert.alert('Erro', 'Localização atual não encontrada. Por favor, habilite o GPS.');
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        Alert.alert('Erro', 'CEP não encontrado.');
        setLoading(false);
        return;
      }
  
      const fullAddress = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`;
      setAddress(fullAddress);
  
      const coords = await Location.geocodeAsync(fullAddress);
      if (coords.length > 0) {
        const destination = { lat: coords[0].latitude, lon: coords[0].longitude };
        setMapRegion({
          latitude: destination.lat,
          longitude: destination.lon,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
  
        const dist = haversineDistance(currentLocation, destination).toFixed(2);
        setDistance(dist);
        
  
        await saveCalculation({
            cep,
            address: fullAddress,
            distance: dist,
            current_location: {
              latitude: currentLocation.lat, 
              longitude: currentLocation.lon, 
            },
          });
  
        Alert.alert('Sucesso', 'Dados salvos no histórico!');
      }
      setLoading(false);
    } catch (error) {
      console.error('Erro ao salvar no banco:', error);
      Alert.alert('Erro', 'Houve um problema ao salvar os dados no banco.');
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Calculadora de Distância</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o CEP"
        value={cep}
        onChangeText={setCep}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={fetchCepLocation}>
        <Text style={styles.buttonText}>Calcular Distância</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => navigation.navigate('History')}>
        <Text style={styles.buttonText}>Ver Histórico</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#1e90ff" />}
      {distance && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resultado</Text>
          <Text>Distância: <Text style={styles.bold}>{distance} km</Text></Text>
          <Text>Endereço: {address}</Text>
        </View>
      )}
      {mapRegion && (
        <MapView style={styles.map} region={mapRegion}>
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.lat,
                longitude: currentLocation.lon,
              }}
              title="Sua Localização"
            />
          )}
          <Marker
            coordinate={{
              latitude: mapRegion.latitude,
              longitude: mapRegion.longitude,
            }}
            title="Local do CEP"
          />
        </MapView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    width: '90%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  button: {
    width: '90%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#1e90ff',
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#ffa07a',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  map: {
    width: '90%',
    height: 300,
    marginTop: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
