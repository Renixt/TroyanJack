// GameScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDeck, shuffleDeck, dealCard, calculateScore, cardImages } from './BlackjackLogic';

export default function GameScreen({ route }) {
  const { playerName } = route.params;
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadGameState = async () => {
      const savedGame = await AsyncStorage.getItem(`gameState_${playerName}`);
      if (savedGame) {
        const gameState = JSON.parse(savedGame);
        setDeck(gameState.deck);
        setPlayerHand(gameState.playerHand);
        setDealerHand(gameState.dealerHand);
        setPlayerScore(gameState.playerScore);
        setDealerScore(gameState.dealerScore);
        setGameOver(gameState.gameOver);
        setMessage(gameState.message);
      }
    };
    loadGameState();
  }, [playerName]);

  const saveGameState = async (newState) => {
    await AsyncStorage.setItem(`gameState_${playerName}`, JSON.stringify(newState));
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
      message: newDealerScore > 21 || playerScore > newDealerScore ? "¡Ganaste!" : newDealerScore === playerScore ? "Es un empate." : "El dealer gana."
    };

    setDeck(newDeck);
    setDealerHand(newDealerHand);
    setDealerScore(newDealerScore);
    setGameOver(true);
    setMessage(newState.message);

    saveGameState(newState);
  };

  const renderCardImages = (hand) => {
    return hand.map((card, index) => {
      const image = cardImages[card.value]?.[card.suit[0]];
      return image ? <Image key={index} source={image} style={styles.cardImage} /> : null;
    });
  };

  return (
    <View style={styles.container}>
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
        <Button title="Nuevo Juego" onPress={startGame} />
        <Button title="Pedir Carta" onPress={hit} />
        <Button title="Plantarse" onPress={stand} />
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  score: {
    fontSize: 18,
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginVertical: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  handContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  handTitle: {
    fontSize: 18,
    marginRight: 10,
  },
  cardImage: {
    width: 60,
    height: 90,
    margin: 5,
  },
});