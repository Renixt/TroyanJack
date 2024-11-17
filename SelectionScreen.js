import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SelectionScreen({ navigation, route }) {
  const { playerName } = route.params;
  const [hasSavedGame, setHasSavedGame] = useState(false);

  useEffect(() => {
    const checkSavedGame = async () => {
      const savedGame = await AsyncStorage.getItem(`savedGames_${playerName}`);
      setHasSavedGame(!!savedGame); // Asegura que sea booleano
    };
    checkSavedGame();
  }, [playerName]);

  const handleNewGame = async () => {
    await AsyncStorage.removeItem(`savedGames_${playerName}`);
    navigation.navigate('Game', { playerName, newGame: true });
  };

  const handleContinueGame = () => {
    navigation.navigate('Game', { playerName, newGame: false });
  };

  return (
    <ImageBackground
      source={require('./pantallah.jpg')} // Fondo igual que la pantalla anterior
      style={styles.container}
    >
      <Text style={styles.title}>
        {hasSavedGame ? `Bienvenido de nuevo, ${playerName}` : `Hola, ${playerName}`}
      </Text>
      <View style={styles.buttonContainer}>
        {hasSavedGame ? (
          <>
            <TouchableOpacity style={styles.button} onPress={handleContinueGame}>
              <Text style={styles.buttonText}>Continuar Juego</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleNewGame}>
              <Text style={styles.buttonText}>Nuevo Juego</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleNewGame}>
            <Text style={styles.buttonText}>Nuevo Juego</Text>
          </TouchableOpacity>
        )}
      </View>
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
    marginBottom: 40,
    color: '#FFD700', // Color dorado
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    width: '80%',
    justifyContent: 'space-between',
    marginVertical: 20,
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
    marginBottom: 20, // Añadir espacio entre botones
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
