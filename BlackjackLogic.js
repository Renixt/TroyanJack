// src/utils/BlackjackLogic.js

// Agregar este objeto en BlackjackLogic.js
export const cardImages = {
  "A": { "C": require("./Imagenes/AsC.png"), "D": require("./Imagenes/AsD.png"), "H": require("./Imagenes/AsH.png"), "S": require("./Imagenes/AsS.png") },
  "2": { "C": require("./Imagenes/2C.png"), "D": require("./Imagenes/2D.png"), "H": require("./Imagenes/2H.png"), "S": require("./Imagenes/2S.png") },
  "3": { "C": require("./Imagenes/3C.png"), "D": require("./Imagenes/3D.png"), "H": require("./Imagenes/3H.png"), "S": require("./Imagenes/3S.png") },
  "4": { "C": require("./Imagenes/4C.png"), "D": require("./Imagenes/4D.png"), "H": require("./Imagenes/4H.png"), "S": require("./Imagenes/4S.png") },
  "5": { "C": require("./Imagenes/5C.png"), "D": require("./Imagenes/5D.png"), "H": require("./Imagenes/5H.png"), "S": require("./Imagenes/5S.png") },
  "6": { "C": require("./Imagenes/6C.png"), "D": require("./Imagenes/6D.png"), "H": require("./Imagenes/6H.png"), "S": require("./Imagenes/6S.png") },
  "7": { "C": require("./Imagenes/7C.png"), "D": require("./Imagenes/7D.png"), "H": require("./Imagenes/7H.png"), "S": require("./Imagenes/7S.png") },
  "8": { "C": require("./Imagenes/8C.png"), "D": require("./Imagenes/8D.png"), "H": require("./Imagenes/8H.png"), "S": require("./Imagenes/8S.png") },
  "9": { "C": require("./Imagenes/9C.png"), "D": require("./Imagenes/9D.png"), "H": require("./Imagenes/9H.png"), "S": require("./Imagenes/9S.png") },
  "10": { "C": require("./Imagenes/10C.png"), "D": require("./Imagenes/10D.png"), "H": require("./Imagenes/10H.png"), "S": require("./Imagenes/10S.png") }
  /*"J": { "C": require("./Imagenes/JC.png"), "D": require("./Imagenes/JD.png"), "H": require("./Imagenes/JH.png"), "S": require("./Imagenes/JS.png") },
  "Q": { "C": require("./Imagenes/QC.png"), "D": require("./Imagenes/QD.png"), "H": require("./Imagenes/QH.png"), "S": require("./Imagenes/QS.png") },
  "K": { "C": require("./Imagenes/KC.png"), "D": require("./Imagenes/KD.png"), "H": require("./Imagenes/KH.png"), "S": require("./Imagenes/KS.png") }*/

};



// Función para crear un nuevo mazo de cartas
export const createDeck = () => {
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let deck = [];
    
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    return deck; // Retorna el mazo completo (52 cartas)
  };
  
  // Función para mezclar el mazo de cartas utilizando el algoritmo de Fisher-Yates
  export const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Intercambia las posiciones de las cartas
    }
    return deck; // Retorna el mazo mezclado
  };
  
  // Función para repartir una carta (toma la última carta del mazo)
  export const dealCard = (deck) => {
    if (deck.length === 0) {
        console.error("El mazo está vacío, no se puede repartir una carta.");
        return null; // Retorna null si no hay cartas
    }
    return deck.pop(); // Remueve y retorna la última carta del mazo
  };
  
  // Función para calcular el puntaje de una mano
  export const calculateScore = (hand) => {
    let score = 0;
    let hasAce = false;
  
    for (let card of hand) {
        if (!card || !card.value) { // Verificación adicional de cartas válidas
            console.error("Carta indefinida encontrada en la mano.");
            continue; // Ignora cartas indefinidas o sin valor
        }
  
        if (card.value === "A") {
            hasAce = true;
            score += 11;
        } else if (["J", "Q", "K"].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    }
  
    // Si hay un As y el puntaje supera 21, reduce el puntaje en 10
    if (hasAce && score > 21) {
        score -= 10;
    }
  
    return score; // Retorna el puntaje final de la mano
  };

  // Función de decisiones básicas del dealer
export const dealerDecisionBasic = (dealerScore, playerScore) => {
    if (dealerScore >= 17) {
      return "Plantarse"; // Dealer se planta si tiene 17 o más puntos
    } else if (dealerScore < 17) {
      return "Pedir carta"; // Dealer pide carta si tiene menos de 17
    }
  };
// Función para calcular la probabilidad de que el dealer se pase si pide otra carta
export const calculateBustProbability = (deck, dealerScore) => {
    if (dealerScore >= 21) return 1.0; // 100% probabilidad de pasarse si ya está en o sobre 21
  
    let bustCount = 0;
  
    // Iterar sobre cada carta en el mazo para contar cuántas harían que el dealer se pase
    for (let card of deck) {
      const cardValue = card.value === "A" ? 11 : (["J", "Q", "K"].includes(card.value) ? 10 : parseInt(card.value));
      if (dealerScore + cardValue > 21) {
        bustCount++;
      }
    }
  
    const probability = bustCount / deck.length;
    return probability;
  };

  // Función de decisión para el dealer utilizando la probabilidad de pasarse
// Función principal que maneja el flujo del juego
export const playDealerTurn = (dealerHand, playerScore) => {
  let dealerScore = calculateScore(dealerHand);

  while (true) {
    // Llamar a dealerDecision para obtener la acción del dealer
    const { action, message } = dealerDecision(dealerHand, playerScore);
    console.log(message); // Mostrar mensaje de acción del dealer

    if (action === "hit") {
      // El dealer pide otra carta
      const newCard = drawCard();
      dealerHand.push(newCard);
      dealerScore = calculateScore(dealerHand);
      console.log(`El dealer saca una carta: ${newCard}. Su puntuación es ahora ${dealerScore}.`);

      // Verificar si el dealer se pasa de 21
      if (dealerScore > 21) {
        console.log("¡El dealer se pasó! El jugador gana.");
        return "playerWins";
      }
    } else if (action === "stand") {
      // El dealer decide plantarse
      console.log("El dealer decide plantarse.");
      break;
    } else if (action === "bluff") {
      // Manejo especial de bluffing
      console.log(message);
      // Puedes permitirle al jugador tomar una acción si lo deseas, o simplemente continuar
      // Aquí solo continuamos con el bucle para que el dealer tome una decisión.
    }
  }

  // Evaluar el resultado final después de que el dealer termina su turno
  if (dealerScore > playerScore) {
    console.log("El dealer gana.");
    return "dealerWins";
  } else if (dealerScore < playerScore) {
    console.log("El jugador gana.");
    return "playerWins";
  } else {
    console.log("Es un empate.");
    return "draw";
  }
};
