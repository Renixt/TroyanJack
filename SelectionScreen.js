// SelectionScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SelectionScreen({ navigation, route }) {
  const { playerName } = route.params;
  const [hasSavedGame, setHasSavedGame] = useState(false);

  useEffect(() => {
    const checkSavedGame = async () => {
      const savedGame = await AsyncStorage.getItem(`gameState_${playerName}`);
      setHasSavedGame(!!savedGame);
    };
    checkSavedGame();
  }, [playerName]);

  const handleNewGame = async () => {
    await AsyncStorage.removeItem(`gameState_${playerName}`);
    navigation.navigate('Game', { playerName });
  };

  const handleContinueGame = () => {
    navigation.navigate('Game', { playerName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {hasSavedGame ? `Bienvenido de nuevo, ${playerName}` : `Hola, ${playerName}`}
      </Text>
      {hasSavedGame ? (
        <View style={styles.buttonContainer}>
          <Button title="Continuar Partida" onPress={handleContinueGame} />
          <Button title="Nuevo Juego" onPress={handleNewGame} />
        </View>
      ) : (
        <Button title="Nuevo Juego" onPress={handleNewGame} />
      )}
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
  buttonContainer: {
    width: '80%',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
});