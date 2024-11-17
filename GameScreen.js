import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDeck, shuffleDeck, dealCard, calculateScore, cardImages } from './BlackjackLogic';

export default function GameScreen({ route }) {
  const { playerName, newGame } = route.params;
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadGameState = async () => {
      if (newGame) {
        startGame();
      } else {
        const savedGames = await AsyncStorage.getItem(`savedGames_${playerName}`);
        if (savedGames) {
          const gameState = JSON.parse(savedGames)[0]; // Cargar la primera partida guardada
          setDeck(gameState.deck);
          setPlayerHand(gameState.playerHand);
          setDealerHand(gameState.dealerHand);
          setPlayerScore(gameState.playerScore);
          setDealerScore(gameState.dealerScore);
          setGameOver(gameState.gameOver);
          setMessage(gameState.message);
        }
      }
    };
    loadGameState();
  }, [playerName, newGame]);

  const saveGameState = async (newState) => {
    const savedGames = await AsyncStorage.getItem(`savedGames_${playerName}`);
    const games = savedGames ? JSON.parse(savedGames) : [];
    games[0] = newState; // Guardar siempre en la primera posición
    await AsyncStorage.setItem(`savedGames_${playerName}`, JSON.stringify(games));
  };

  const startGame = () => {
    const newDeck = shuffleDeck(createDeck());
    if (newDeck.length === 0) {
      setMessage("Hubo un error al crear la baraja.");
      return;
    }

    const playerInitialHand = [dealCard(newDeck), dealCard(newDeck)].filter(card => card);
    const dealerInitialHand = [dealCard(newDeck), dealCard(newDeck)].filter(card => card);

    const newState = {
      deck: newDeck,
      playerHand: playerInitialHand,
      dealerHand: dealerInitialHand,
      playerScore: calculateScore(playerInitialHand),
      dealerScore: calculateScore(dealerInitialHand),
      gameOver: false,
      message: ""
    };

    setDeck(newDeck);
    setPlayerHand(playerInitialHand);
    setDealerHand(dealerInitialHand);
    setPlayerScore(newState.playerScore);
    setDealerScore(newState.dealerScore);
    setGameOver(false);
    setMessage("");

    saveGameState(newState);
  };

  const hit = () => {
    if (gameOver) return;

    const newDeck = [...deck];
    const card = dealCard(newDeck);
    if (!card) {
      setMessage("No quedan más cartas en el mazo.");
      return;
    }

    const newPlayerHand = [...playerHand, card];
    const newPlayerScore = calculateScore(newPlayerHand);

    const newState = {
      deck: newDeck,
      playerHand: newPlayerHand,
      dealerHand,
      playerScore: newPlayerScore,
      dealerScore,
      gameOver: newPlayerScore > 21,
      message: newPlayerScore > 21 ? "Te pasaste de 21. ¡Perdiste!" : ""
    };

    setDeck(newDeck);
    setPlayerHand(newPlayerHand);
    setPlayerScore(newPlayerScore);
    setGameOver(newState.gameOver);
    setMessage(newState.message);

    saveGameState(newState);
  };

  const stand = () => {
    if (gameOver) return;

    let newDeck = [...deck];
    let newDealerHand = [...dealerHand];
    let newDealerScore = calculateScore(newDealerHand);

    while (newDealerScore < 17) {
      const card = dealCard(newDeck);
      if (!card) {
        setMessage("No quedan más cartas en el mazo.");
        return;
      }
      newDealerHand.push(card);
      newDealerScore = calculateScore(newDealerHand);
    }

    const newState = {
      deck: newDeck,
      playerHand,
      dealerHand: newDealerHand,
      playerScore,
      dealerScore: newDealerScore,
      gameOver: true,
      message: newDealerScore > 21 || playerScore > newDealerScore ? "¡Ganaste!" : newDealerScore === playerScore ? "El dealer gana." : "El dealer gana."
    };

    setDeck(newDeck);
    setDealerHand(newDealerHand);
    setDealerScore(newDealerScore);
    setGameOver(true);
    setMessage(newState.message);

    saveGameState(newState);
  };

  const continueGame = () => {
    const newDeck = [...deck];
    const playerInitialHand = [dealCard(newDeck), dealCard(newDeck)].filter(card => card);
    const dealerInitialHand = [dealCard(newDeck), dealCard(newDeck)].filter(card => card);

    const newState = {
      deck: newDeck,
      playerHand: playerInitialHand,
      dealerHand: dealerInitialHand,
      playerScore: calculateScore(playerInitialHand),
      dealerScore: calculateScore(dealerInitialHand),
      gameOver: false,
      message: ""
    };

    setDeck(newDeck);
    setPlayerHand(playerInitialHand);
    setDealerHand(dealerInitialHand);
    setPlayerScore(newState.playerScore);
    setDealerScore(newState.dealerScore);
    setGameOver(false);
    setMessage("");

    saveGameState(newState);
  };

  const renderCardImages = (hand) => {
    return hand.map((card, index) => {
      const image = cardImages[card.value]?.[card.suit[0]];
      return image ? <Image key={index} source={image} style={styles.cardImage} /> : null;
    });
  };

  return (
    <ImageBackground
      source={require('./2.png')} // Ruta a la imagen de fondo
      style={styles.container}
    >
      <Text style={styles.title}>Juego de Blackjack</Text>
      <Text style={styles.subtitle}>Jugador: {playerName}</Text>
      <Text style={styles.score}>Puntaje del dealer: {dealerScore}</Text>
      <View style={styles.handContainer}>
        <Text style={styles.handTitle}>Mano del dealer:</Text>
        {renderCardImages(dealerHand)}
      </View>
      <Text style={styles.score}>Tu puntaje: {playerScore}</Text>
      <View style={styles.handContainer}>
        <Text style={styles.handTitle}>Mano del jugador:</Text>
        {renderCardImages(playerHand)}
      </View>
      <View style={styles.buttonContainer}>
        {!gameOver && (
          <>
            <Button title="Pedir Carta" onPress={hit} />
            <Button title="Plantarse" onPress={stand} />
          </>
        )}
        {gameOver && (
          <View style={styles.gameOverButtons}>
            <Button title="Nuevo Juego" onPress={startGame} />
            <Button title="Continuar" onPress={continueGame} />
          </View>
        )}
      </View>
      <Text style={styles.message}>{message}</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#fff',
  },
  score: {
    fontSize: 18,
    marginVertical: 5,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginVertical: 20,
  },
  gameOverButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 20,
  },
  handContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  handTitle: {
    fontSize: 18,
    marginRight: 10,
    color: '#fff',
  },
  cardImage: {
    width: 50,
    height: 75,
    marginRight: 10,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#fff',
  },
});
