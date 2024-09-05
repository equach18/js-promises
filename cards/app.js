// 1. Make a request to the [Deck of Cards API](http://deckofcardsapi.com/) to request a single card from a newly shuffled deck. Once you have the card, ***console.log*** the value and the suit (e.g. “5 of spades”, “queen of diamonds”).
// part1
const baseURL = "http://deckofcardsapi.com/api/deck";
axios
  .get(`${baseURL}/new/draw/?count=1`)
  .then((response) => {
    card = response.data.cards[0];
    console.log(`${card.value} of ${card.suit.toLowerCase()}`);
  })
  .catch((err) => {
    console.log(`${err}`);
  });

// 2. Make a request to the deck of cards API to request a single card from a newly shuffled deck. Once you have the card, make a request to the same API to get one more card from the **same** deck.

//     Once you have both cards, ***console.log*** the values and suits of both cards.

axios
  .get(`${baseURL}/new/draw/?count=1`)
  .then((response) => {
    const deckId = response.data.deck_id;
    const card1 = response.data.cards[0];
    console.log(`First Card: ${card1.value} of ${card1.suit.toLowerCase()}`);
    return axios.get(`${baseURL}/${deckId}/draw/?count=1`);
  })
  .then((response) => {
    const card2 = response.data.cards[0];
    console.log(`Second Card: ${card2.value} of ${card2.suit.toLowerCase()}`);
  })
  .catch((err) => {
    console.log(`${err}`);
  });

// 3. Build an HTML page that lets you draw cards from a deck. When the page loads, go to the Deck of Cards API to create a new deck, and show a button on the page that will let you draw a card. Every time you click the button, display a new card, until there are no cards left in the deck.

function deckHandler() {
  let deckId = null;

  return {
    // shuffle the deck and return the promise
    shuffleDeck: () => {
      return axios
        .get(`${baseURL}/new/shuffle/?deck_count=1`)
        .then((response) => {
          deckId = response.data.deck_id;
          //   return the deck id so that it can be used later
          return deckId;
        });
    },

    // draw a card from the shuffled deck
    drawCard: () => {
      return axios
        .get(`${baseURL}/${deckId}/draw/?count=1`)
        .then((response) => {
          if (response.data.remaining == 0) {
            $("button").remove();
            return Promise.reject(new Error("No more cards left to draw."));
          }
          const cardPng = response.data.cards[0].image;
          const randomDeg = Math.floor(Math.random() * 361);
          const randomX = Math.floor(Math.random() * 30 - 15);
          const randomY = Math.floor(Math.random() * 30 - 15);
          //   add img to the container
          let img = $("<img>", {
            src: cardPng,
            css: {
              transform: `translate(${randomX}px, ${randomY}px) rotate(${randomDeg}deg)`,
            },
          });
          $("#card-container").append(img);
        });
    },
  };
}

// create a new deck handler and shuffle
const newDeck = deckHandler();
newDeck.shuffleDeck();

// when the dom is ready, add an event listener for the button to draw a new card
$(document).ready(function () {
  $("button").on("click", function () {
    newDeck.drawCard().catch((error) => console.error(error));
  });
});
