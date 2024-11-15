// HomeScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState('');

  const handleStart = async () => {
    if (name) {
      await AsyncStorage.setItem('playerName', name);
      navigation.navigate('Selection', { playerName: name });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido al Blackjack</Text>
      <TextInput
        style={styles.input}
        placeholder="¿Cómo quieres que te llamen?"
        value={name}
        onChangeText={setName}
      />
      <Button title="Continuar" onPress={handleStart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
});