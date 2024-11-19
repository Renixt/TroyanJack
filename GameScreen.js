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
  const [fichas, setFichas] = useState('');


  useEffect(() => {
    const loadGameState = async () => {
      try {
        const savedFichas = await AsyncStorage.getItem('fichas');
        if (savedFichas) setFichas(savedFichas);
      } catch (error) {
        console.log('Error al cargar las fichas guardadas')
      }
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

    const handleGameEnd = async () => {
      console.log('---------hit: handlegame()')
      let newFichas;
      // let message;

      if (newPlayerScore > 21) {
        newFichas = parseInt(fichas) - 50;
        setFichas(newFichas);
        try {
          await AsyncStorage.setItem('fichas', newFichas.toString());
          console.log('resta completada, te pasaste');
        } catch (error) {
          console.log('error al guardar las fichas ganadoras')
        }
        // message= `¡Ganaste!, ahora tienes ${fichas} fichas`;
      }
      //return message;

    };

   handleGameEnd();
    const newState = {
      deck: newDeck,
      playerHand: newPlayerHand,
      dealerHand,
      playerScore: newPlayerScore,
      dealerScore,
      gameOver: newPlayerScore > 21,
      message: newPlayerScore > 21 ? `Te pasaste de 21!, -50 fichas` : ""
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


    const handleGameEnd = async () => {
      console.log('---------stand: handlegame()')
      let newFichas;
      // let message;

      if (newDealerScore > 21 || playerScore > newDealerScore) {
        newFichas = parseInt(fichas) + 50;
        setFichas(newFichas);
        try {
          await AsyncStorage.setItem('fichas', newFichas.toString());
          console.log('suma completada, tu ganas');
        } catch (error) {
          console.log('error al guardar las fichas ganadoras')
        }
        // message= `¡Ganaste!, ahora tienes ${fichas} fichas`;
      } else {

        newFichas = parseInt(fichas) - 50;
        setFichas(newFichas);
        try {
          await AsyncStorage.setItem('fichas', newFichas.toString());
          console.log('resta completada, dealer gana');
        } catch (error) {
          console.log('error al guardar las fichas ganadoras')
        }
        //  message = `El dealer gana, ahora tienes ${fichas} fichas`;
      }
      //return message;

    };

    handleGameEnd();
    const newState = {
      deck: newDeck,
      playerHand,
      dealerHand: newDealerHand,
      playerScore,
      dealerScore: newDealerScore,
      gameOver: true,
      message: newDealerScore > 21 || playerScore > newDealerScore
        ? (() => {
          // newFichas= parseInt(fichas) + 50;
          // setFichas(newFichas);
          // await AsyncStorage.setItem('fichas', newFichas.toString());

          return `¡Ganaste!, +50 fichas`;

        })() : (() => {
          //newFichas = parseInt(fichas) -50;
          // setFichas(newFichas);

          return `El dealer gana, -50 fichas`;

        })

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

  /*<Text style={styles.subtitle}>Jugador: {playerName}</Text>
        <Text style={styles.score}>Puntaje del dealer: {dealerScore}</Text>
      <Text style={styles.score}>Tu puntaje: {playerScore}</Text>

  */ 

  return (
    <ImageBackground
      source={require('./2.png')} // Ruta a la imagen de fondo
      style={styles.container}
    >

    <View style={styles.chipsContainer}>
      <Text style={styles.chipsText}>Fichas: {fichas}</Text>
    </View>
      <Text style={styles.title}>TroyanJack</Text>
      
      <Text style={styles.subtitle}>Apuesta: 50 fichas</Text>

      <View style={styles.handContainer}>
        <Text style={styles.handTitle}>Mano del dealer:</Text>
        {renderCardImages(dealerHand)}
      </View>
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
            <Button title="Reiniciar Mazo" onPress={startGame} />
            <Button title="Seguir Jugando" onPress={continueGame} />
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
  chipsContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 8,
  },
  chipsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',},

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
