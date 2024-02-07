const request = require("request-promise");

const baseUrl = "https://deckofcardsapi.com";
const prefix = "api/deck";

// Class representing a Wheretheiss api
class DeckOfCardsApi {
  // Constructor initializes default request options
  constructor() {
    this.request = request.defaults({
      json: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Method to create shuffled deck(s)
   *
   * @param {number} [deckCount=1] - The number of decks to be shuffled (default is 1).
   * @param {boolean} [resolveWithFullResponse=false] - Whether to resolve with the full response.
   *
   * @returns {Promise} - Promise representing ISS location details
   */
  shuffleDeck(deckCount = 1, resolveWithFullResponse = false) {
    const path = `${baseUrl}/${prefix}/new/shuffle/?deck_count=${deckCount}`;
    return this.request.get({
      url: path,
      resolveWithFullResponse: resolveWithFullResponse
    });
  }

  /**
   * Draws cards from the deck
   *
   * @param {string} deckId - The ID of the deck from which cards are to be drawn.
   * @param {number} cardCount - The number of cards to be drawn.
   * @param {boolean} [resolveWithFullResponse=false] - Whether to resolve with the full response.
   *
   * @returns {Promise} - Promise representing the drawn cards.
   */
  drawCards(deckId, cardCount, resolveWithFullResponse = false) {
    const path = `${baseUrl}/${prefix}/${deckId}/draw/?count=${cardCount}`;
    return this.request.get({
      url: path,
      resolveWithFullResponse: resolveWithFullResponse
    });
  }

  /**
   * Reshuffles the cards in the specified deck.
   *
   * @param {string} deckId - The ID of the deck to be reshuffled.
   * @param {boolean} [resolveWithFullResponse=false] - Whether to resolve with the full response.
   *
   * @returns {Promise} - Promise representing the reshuffled deck.
   */
  reshuffleCards(deckId, resolveWithFullResponse = false) {
    const path = `${baseUrl}/${prefix}/${deckId}/shuffle/`;
    return this.request.get({
      url: path,
      resolveWithFullResponse: resolveWithFullResponse
    });
  }

  /**
   * Gets a brand new deck of cards.
   *
   * @param {boolean} [areJokersEnabled=false] - Indicates whether jokers are enabled in the deck.
   *
   * @returns {Promise} - Promise representing the brand new deck of cards.
   */
  getBrandNewDeck(areJokersEnabled = false) {
    const path = `${baseUrl}/${prefix}/new/?jokers_enabled=${areJokersEnabled}`;
    return this.request.get({
      url: path,
    });
  }

  /**
   * Gets a partial deck of cards based on provided card codes.
   *
   * @param {string} cardCodes - Comma-separated string of card codes.
   * @param {boolean} [resolveWithFullResponse=false] - Whether to resolve with the full response.
   *
   * @returns {Promise} - Promise representing the partial deck of cards.
   */
  getPartialDeck(cardCodes, resolveWithFullResponse = false) {
    const path = `${baseUrl}/${prefix}/new/shuffle/?cards=${cardCodes}`;
    return this.request.get({
      url: path,
      resolveWithFullResponse: resolveWithFullResponse
    });
  }

  /**
   * Adds previously drawn cards to a pile.
   *
   * @param {string} deckId - The ID of the deck containing the cads.
   * @param {string} pileName - The name of the pile to add cards to.
   * @param {string} cardCodes - Comma-separated string of card codes to add to the pile.
   * @param {boolean} [resolveWithFullResponse=false] - Whether to resolve with the full response.
   *
   * @returns {Promise} - Promise representing the updated pile of cards.
   */
  addCardsToPile(deckId, pileName, cardCodes, resolveWithFullResponse = false) {
    const path = `${baseUrl}/${prefix}/${deckId}/pile/${pileName}/add?cards=${cardCodes}`;
    return this.request.get({
      url: path,
      resolveWithFullResponse: resolveWithFullResponse
    });
  }

  /**
   * Shuffles the cards in a specified pile
   *
   * @param {string} deckId - The ID of the deck containing the pile.
   * @param {string} pileName - The name of the pile to shuffle.
   * @param {boolean} [resolveWithFullResponse=false] - Whether to resolve with the full response.
   *
   * @returns {Promise} - Promise representing the shuffled pile of cards.
   */
  shufflePile(deckId, pileName, resolveWithFullResponse = false) {
    const path = `${baseUrl}/${prefix}/${deckId}/pile/${pileName}/shuffle/`;
    return this.request.get({
      url: path,
      resolveWithFullResponse: resolveWithFullResponse
    });
  }

  /**
   * Lists all the cards in a specified pile
   *
   * @param {string} deckId - The ID of the deck containing the pile.
   * @param {string} pileName - The name of the pile to list cards from.
   * @param {boolean} [resolveWithFullResponse=false] - Whether to resolve with the full response.
   *
   * @returns {Promise} - Promise representing the list of cards in the pile.
   */
  listPileCards(deckId, pileName, resolveWithFullResponse = false) {
    const path = `${baseUrl}/${prefix}/${deckId}/pile/${pileName}/list/`;
    return this.request.get({
      url: path,
      resolveWithFullResponse: resolveWithFullResponse
    });
  }

  /**
   * Draws a specified number of cards from a pile in the deck.
   *
   * @param {string} deckId - The ID of the deck containing the pile.
   * @param {string} pileName - The name of the pile from which to draw cards.
   * @param {number} cardCount - The number of cards to draw from the pile.
   * @param {boolean} [resolveWithFullResponse=false] - Whether to resolve with the full response.
   *
   * @returns {Promise} - Promise representing the drawn cards from the pile.
   */
  drawNumberOfCardsFromPile(deckId, pileName, cardCount, resolveWithFullResponse = false) {
    const path = `${baseUrl}/${prefix}/${deckId}/pile/${pileName}/draw/?count=${cardCount}`;
    return this.request.get({
      url: path,
      resolveWithFullResponse: resolveWithFullResponse
    });
  }

  /**
   * Returns all previously drawn cards to original deck
   *
   * @param {string} deckId - The ID of the deck from which cards were drawn
   * @param {boolean} [resolveWithFullResponse=false] - Whether to resolve with the full response
   *
   * @returns {Promise} - Promise representing the returned cards to the main deck
   */
  returnCardsToDeck(deckId, resolveWithFullResponse = false) {
    const path = `${baseUrl}/${prefix}/${deckId}/return/`;
    return this.request.get({
      url: path,
      resolveWithFullResponse: resolveWithFullResponse
    });
  }

  /**
   * Returns all cards from the specified pile to the main deck.
   *
   * @param {string} deckId - The ID of the deck containing the pile.
   * @param {string} pileName - The name of the pile from which to return cards.
   * @param {boolean} [resolveWithFullResponse=false] - Whether to resolve with the full response.
   *
   * @returns {Promise} - Promise representing the returned cards from the pile to the main deck.
   */
  returnPileToDeck(deckId, pileName, resolveWithFullResponse = false) {
    const path = `${baseUrl}/${prefix}/${deckId}/pile/${pileName}/return/`;
    return this.request.get({
      url: path,
      resolveWithFullResponse: resolveWithFullResponse
    });
  }
}

module.exports = DeckOfCardsApi;
