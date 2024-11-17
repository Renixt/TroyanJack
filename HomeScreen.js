import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState('');

  const handleStart = async () => {
    if (name) {
      await AsyncStorage.setItem('playerName', name);
      navigation.navigate('Selection', { playerName: name });
    } else {
      Alert.alert('Advertencia', 'Por favor, ingresa tu nombre');
    }
  };

  return (
    <ImageBackground
      source={require('./pantallah.jpg')}
      style={styles.container}
    >
      <Text style={styles.title}>Bienvenido al Troyanjack</Text>
      <TextInput
        style={styles.input}
        placeholder="¿Cómo quieres que te llamen?"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centra el contenido en la pantalla
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20, // Ajuste el margen inferior para el título
    color: '#FFD700', // Color dorado
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  input: {
    width: '80%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 30,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff', // Color dorado
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
