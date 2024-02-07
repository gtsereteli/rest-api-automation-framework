const { faker } = require("@faker-js/faker");

// Deck of card codes
const cardDeck = [
  '8S', '4H', '3C', '7C', 'KH', '8D', 'QH', 'AC', 'JS', 'JH', '9C', 'QD',
  'KC', '0C', 'KS', '6C', '2S', '2C', '7D', 'KD', '5S', '5C', 'QC', '9S',
  'JC', '0D', '6D', '2H', 'JD', '4S', '6H', 'AH', '3S', '5H', '6S', '4C',
  '2D', '9H', '9D', '0H', '8C', '0S', '7H', 'AS', '5D', '7S', '3D', '4D',
  '8H', 'AD', 'QS', '3H'
];

/**
 * Generates a random pile name of the specified length.
 *
 * @param {number} nameLength - The length of the pile name to generate.
 *
 * @returns {string} - Randomly generated pile name.
 */
function getPileName(nameLength) {
  return faker.random.alphaNumeric(nameLength);
}

/**
 * Utility function to extract card codes from an array of drawn cards.
 *
 * @param {Object[]} cards - Array of drawn cards with 'code' property.
 *
 * @returns {string} - Comma-separated string of card codes.
 */
function getCardCodes(cards) {
  // Empty string to store the card codes
  let cardCodes = '';

  // Loop through each card in the array of card objects
  for (let card of cards) {
    // Append the card code followed by a comma to the string
    cardCodes += `${card.code},`;
  }

  // Remove the trailing comma and return the string of card codes
  return cardCodes.slice(0, -1);
}

/**
 * Generates a random list of card codes from the card deck.
 *
 * @returns {string} - Comma-separated string of random card codes.
 */
function getRandomCards() {
  const randomValues = faker.helpers.arrayElements(cardDeck, faker.datatype.number({ min: 1, max: cardDeck.length }));

  // Generate a random amount of comma-separated values
  return commaSeparatedValues = randomValues.join(',');
}

module.exports = {
  getCardCodes,
  getRandomCards,
  getPileName
};
