import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { createDeck, shuffleDeck, dealCard, calculateScore, dealerDecision, cardImages } from './BlackjackLogic';

export default function App() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  const startGame = () => {
    const newDeck = shuffleDeck(createDeck());
    if (newDeck.length === 0) {
      setMessage("Hubo un error al crear la baraja.");
      return;
    }

    const playerInitialHand = [dealCard(newDeck), dealCard(newDeck)].filter(card => card);
    const dealerInitialHand = [dealCard(newDeck), dealCard(newDeck)].filter(card => card);

    setDeck(newDeck);
    setPlayerHand(playerInitialHand);
    setDealerHand(dealerInitialHand);
    setPlayerScore(calculateScore(playerInitialHand));
    setDealerScore(calculateScore(dealerInitialHand));
    setGameOver(false);
    setMessage("");
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

    setDeck(newDeck);
    setPlayerHand(newPlayerHand);
    setPlayerScore(newPlayerScore);

    if (newPlayerScore > 21) {
      setGameOver(true);
      setMessage("Te pasaste de 21. ¡Perdiste!");
    }
  };
//Inicio Arbol
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

    setDeck(newDeck);
    setDealerHand(newDealerHand);
    setDealerScore(newDealerScore);
    setGameOver(true);

    // Evaluar el resultado del juego
    if (newDealerScore > 21 || playerScore > newDealerScore) {
      setMessage("¡Ganaste!");
    } else if (playerScore === newDealerScore) {
      setMessage("Es un empate.");
    } else {
      setMessage("El dealer gana.");
    }
  };

  // Función para renderizar las cartas
  const renderCardImages = (hand) => {
    return hand.map((card, index) => {
      const image = cardImages[card.value]?.[card.suit[0]]; // Usar la primera letra del palo (C, D, H, S)
      return image ? <Image key={index} source={image} style={styles.cardImage} /> : null;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Juego de Blackjack</Text>
      <Text style={styles.score}>Tu puntaje: {playerScore}</Text>
      <Text style={styles.score}>Puntaje del dealer: {dealerScore}</Text>

      <View style={styles.handContainer}>
        <Text style={styles.handTitle}>Mano del jugador:</Text>
        {renderCardImages(playerHand)}
      </View>

      <View style={styles.handContainer}>
        <Text style={styles.handTitle}>Mano del dealer:</Text>
        {renderCardImages(dealerHand)}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Iniciar juego" onPress={startGame} />
        <Button title="Pedir carta" onPress={hit} disabled={gameOver} />
        <Button title="Plantarse" onPress={stand} disabled={gameOver} />
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
