const { expect } = require("chai");
const Api = require("../../src/Cards-api");
const guard = require("../../utils/guard");
const { getCardCodes, getRandomCards, getPileName } = require('../../utils/cardHelper');
const validateJsonSchema = require('../../utils/jsonSchemaValidator');

// JSON shchemas
const shuffleDeckSchema = require('../../schemas/cards/shuffleDeckSchema.json');
const drawCardsSchema = require('../../schemas/cards/drawCardsSchema.json');
const drawCardsFromPileSchema = require('../../schemas/cards/drawCardsFromPileSchema.json');
const getCardPileSchema = require('../../schemas/cards/getCardPileSchema.json');
const listCardsInPileSchema = require('../../schemas/cards/drawCardsFromPileSchema.json');
const shuffleCardPileSchema = require('../../schemas/cards/shuffleCardPileSchema.json');

// Variable to hold the instance of the Api class
let api;

// Setting up the instance of the Api class before running the tests
before(() => {
  api = new Api();
});

/**
 * Test Suite: Deck of cards api tests
 *
 * Purpose:
 * These are different test cases on all endpoints of Deck of Cards API.
 * I added positive and negative scenarios where API could return coresponding response.
 * I think there are more ways to refactor code and include mocha hooks but I got
 * stuck with work tasks yesterday. Today afternoon, I will try to add more negative scenarios and some
 * sort of test cleanup with returning cards/piles back to deck.
 */
describe("Deck of cards api tests", function () {
  describe("Can create new deck (GET /api/deck)", function () {
    it("Can shuffle a deck", async function () {
      const shuffleDeckResp = await guard(async () => api.shuffleDeck());
      const isSchemaValid = validateJsonSchema(shuffleDeckResp, shuffleDeckSchema);

      expect(isSchemaValid).to.be.true;
      expect(shuffleDeckResp).to.have.property("success", true);
      expect(shuffleDeckResp).to.have.property("shuffled", true);
      expect(shuffleDeckResp).to.have.property("remaining", 52);
    });

    it("Can shuffle 5 decks", async function () {
      const shuffleDeckResp = await guard(async () => api.shuffleDeck(5));
      const isSchemaValid = validateJsonSchema(shuffleDeckResp, shuffleDeckSchema);

      expect(isSchemaValid).to.be.true;
      expect(shuffleDeckResp).to.have.property("success", true);
      expect(shuffleDeckResp).to.have.property("shuffled", true);
      expect(shuffleDeckResp).to.have.property("remaining", 52 * 5);
    });

    it("Error returned when shuffling 0 decks", async function () {
      const shuffleDeckResp = await guard(async () => api.shuffleDeck(0));

      expect(shuffleDeckResp).to.have.property("success", false);
      expect(shuffleDeckResp).to.have.property("error", "The min number of Decks is 1.");
    });

    describe("Can draw different number of cards", function () {
      it("Can draw 1 card", async function () {
        const shuffleDeckResp = await guard(async () => api.shuffleDeck());
        const drawCardsResp = await guard(async () => api.drawCards(shuffleDeckResp.deck_id, 1));
        const isSchemaValid = validateJsonSchema(drawCardsResp, drawCardsSchema);

        expect(isSchemaValid).to.be.true;
        expect(drawCardsResp).to.have.property("success", true);
        expect(drawCardsResp).to.have.property("remaining", 51);
        expect(drawCardsResp.cards).to.be.an('array');
        expect(drawCardsResp.cards).to.have.lengthOf(1);
      });

      it("Can get correct remaining count when drawing 0 cards", async function () {
        const cardNumberToDraw = 0;
        const shuffleDeckResp = await guard(async () => api.shuffleDeck());
        const drawCardsResp = await guard(async () => api.drawCards(shuffleDeckResp.deck_id, cardNumberToDraw));

        expect(drawCardsResp).to.have.property("success", true);
        expect(drawCardsResp).to.have.property("remaining", 52);
      });

      it("Can get error when drawing more than remaining number cards", async function () {
        const cardNumberToDraw = 100;
        const shuffleDeckResp = await guard(async () => api.shuffleDeck());
        const drawCardsResp = await guard(async () => api.drawCards(shuffleDeckResp.deck_id, cardNumberToDraw));

        expect(drawCardsResp).to.have.property("success", false);
        expect(drawCardsResp).to.have.property("error", `Not enough cards remaining to draw ${cardNumberToDraw} additional`);
      });
    });

    it("Can reshuffle the cards", async function () {
      const shuffleDeckResp = await guard(async () => api.shuffleDeck());
      const reshuffleCardsCardsResp = await guard(async () => api.reshuffleCards(shuffleDeckResp.deck_id));
      const isSchemaValid = validateJsonSchema(reshuffleCardsCardsResp, shuffleDeckSchema);

      expect(isSchemaValid).to.be.true;
      expect(reshuffleCardsCardsResp.deck_id).to.be.eql(shuffleDeckResp.deck_id);
      expect(reshuffleCardsCardsResp).to.have.property("success", true);
      expect(shuffleDeckResp).to.have.property("shuffled", true);
    });

    it("Error returned for reshuffle without deck id", async function () {

      // Maybe DD test with missing and wrong deck id

      const reshuffleCardsCardsResp = await guard(async () => api.reshuffleCards());

      expect(reshuffleCardsCardsResp.error).to.have.property("success", false);
      expect(reshuffleCardsCardsResp.error).to.have.property("error", "Deck ID does not exist.");
    });

    it("Can get brand new deck", async function () {
      const getBrandNewDeckResp = await guard(async () => api.getBrandNewDeck());
      const isSchemaValid = validateJsonSchema(getBrandNewDeckResp, shuffleDeckSchema);

      expect(isSchemaValid).to.be.true;
      expect(getBrandNewDeckResp).to.have.property("success", true);
      expect(getBrandNewDeckResp).to.have.property("remaining", 52);
      expect(getBrandNewDeckResp).to.have.property("shuffled", false);
    });

    it("Can get deck with two Jokers", async function () {
      const newDeckWithJokersResp = await guard(async () => api.getBrandNewDeck(true));
      const isSchemaValid = validateJsonSchema(newDeckWithJokersResp, shuffleDeckSchema);

      expect(isSchemaValid).to.be.true;
      expect(newDeckWithJokersResp).to.have.property("success", true);
      expect(newDeckWithJokersResp).to.have.property("remaining", 54);
    });

    it("Can get partial deck with random cards", async function () {
      const cards = getRandomCards();
      const partialDeckResp = await guard(async () => api.getPartialDeck(cards));
      const isSchemaValid = validateJsonSchema(partialDeckResp, shuffleDeckSchema);

      expect(isSchemaValid).to.be.true;
      expect(partialDeckResp).to.have.property("success", true);
      expect(partialDeckResp).to.have.property("shuffled", true);
      expect(partialDeckResp).to.have.property("remaining", cards.split(",").length);
    });
  });

  describe("Can create new pile of cards (GET /pile)", function () {
    it("Can add drawn card(s) to a pile", async function () {
      const shuffleDeckResp = await guard(async () => api.shuffleDeck());
      const drawCardsResp = await guard(async () => api.drawCards(shuffleDeckResp.deck_id, 10));
      const drawnCards = getCardCodes(drawCardsResp.cards);
      const pileName = getPileName(7);
      const addCardsToPileResp = await guard(async () => api.addCardsToPile(shuffleDeckResp.deck_id, pileName, drawnCards));

      expect(addCardsToPileResp).to.have.property("success", true);
      expect(addCardsToPileResp.piles[pileName]).to.have.property("remaining", drawnCards.split(",").length);
    });

    it("Can not create pile with more than one deck", async function () {
      const shuffleDeckResp = await guard(async () => api.shuffleDeck(5));
      const drawCardsResp = await guard(async () => api.drawCards(shuffleDeckResp.deck_id, 60));
      const pileName = getPileName(10);
      const addCardsToPileResp = await guard(async () => api.addCardsToPile(shuffleDeckResp.deck_id, pileName, getCardCodes(drawCardsResp.cards)));

      expect(addCardsToPileResp).to.have.property("success", true);
      expect(addCardsToPileResp.piles[pileName]).to.have.property("remaining", 0);
      expect(addCardsToPileResp.deck_id).to.be.eql(shuffleDeckResp.deck_id);
    });

    it("Can shuffle the pile", async function () {
      const shuffleDeckResp = await guard(async () => api.shuffleDeck());
      const drawCardsResp = await guard(async () => api.drawCards(shuffleDeckResp.deck_id, 10));
      const pileName = getPileName(20);
      const cardPileResp = await guard(async () => api.addCardsToPile(shuffleDeckResp.deck_id, pileName, getCardCodes(drawCardsResp.cards)));
      const shufflePileResp = await guard(async () => api.shufflePile(cardPileResp.deck_id, pileName));

      expect(shufflePileResp).to.have.property("success", true);
      expect(shufflePileResp.deck_id).to.be.eql(cardPileResp.deck_id);
    });

    it("Can list cards in pile", async function () {
      const shuffleDeckResp = await guard(async () => api.shuffleDeck());
      const drawCardsResp = await guard(async () => api.drawCards(shuffleDeckResp.deck_id, 5));
      const pileName = getPileName(15);
      const cardPileResp = await guard(async () => api.addCardsToPile(shuffleDeckResp.deck_id, pileName, getCardCodes(drawCardsResp.cards)));
      const listPileCardsResp = await guard(async () => api.listPileCards(cardPileResp.deck_id, pileName));

      expect(listPileCardsResp).to.have.property("success", true);
      expect(listPileCardsResp.piles[pileName].cards).to.be.an("array").that.has.lengthOf(5);
    });

    it("Can draw cards from the pile", async function () {
      const shuffleDeckResp = await guard(async () => api.shuffleDeck());
      const drawCardsResp = await guard(async () => api.drawCards(shuffleDeckResp.deck_id, 15));
      const pileName = getPileName(10);
      const cardPileResp = await guard(async () => api.addCardsToPile(shuffleDeckResp.deck_id, pileName, getCardCodes(drawCardsResp.cards)));
      const drawCardFromPileResp = await guard(async () => api.drawNumberOfCardsFromPile(cardPileResp.deck_id, pileName, 10));

      expect(drawCardFromPileResp).to.have.property("success", true);
      expect(drawCardFromPileResp.piles[pileName].remaining).to.be.equal(5);
    });

    it("Error returned when drawing too many cards from the pile", async function () {
      const shuffleDeckResp = await guard(async () => api.shuffleDeck());
      const drawCardsResp = await guard(async () => api.drawCards(shuffleDeckResp.deck_id, 15));
      const pileName = getPileName(5);
      const cardPileResp = await guard(async () => api.addCardsToPile(shuffleDeckResp.deck_id, pileName, getCardCodes(drawCardsResp.cards)));
      const drawCardFromPileResp = await guard(async () => api.drawNumberOfCardsFromPile(cardPileResp.deck_id, pileName, 200));

      expect(drawCardFromPileResp.error).to.have.property("success", false);
      expect(drawCardFromPileResp.error).to.have.property("error", "Not enough cards remaining to draw 200 additional");
    });
  });

  describe("Can return drawn cards (GET /return)", function () {
    it("Can return drawn cards to deck", async function () {
      const shuffleDeckResp = await guard(async () => api.shuffleDeck());
      const drawCardsResp = await guard(async () => api.drawCards(shuffleDeckResp.deck_id, 3));
      const returnCardsToDeckResp = await guard(async () => api.returnCardsToDeck(drawCardsResp.deck_id));

      expect(returnCardsToDeckResp).to.have.property("success", true);
      expect(returnCardsToDeckResp.deck_id).to.be.eql(shuffleDeckResp.deck_id);
      expect(returnCardsToDeckResp).to.have.property("remaining", 52);
    });

    it("Can return entire pile to deck", async function () {
      const shuffleDeckResp = await guard(async () => api.shuffleDeck());
      const drawCardsResp = await guard(async () => api.drawCards(shuffleDeckResp.deck_id, 5));
      const pileName = getPileName(5);
      const cardPileResp = await guard(async () => api.addCardsToPile(shuffleDeckResp.deck_id, pileName, getCardCodes(drawCardsResp.cards)));
      const returnPileToDeckResp = await guard(async () => api.returnPileToDeck(shuffleDeckResp.deck_id, pileName));

      expect(cardPileResp).to.have.property("success", true);
      expect(returnPileToDeckResp).to.have.property("success", true);
      expect(returnPileToDeckResp).to.have.property("remaining", 52);
      expect(returnPileToDeckResp.deck_id).to.be.eql(shuffleDeckResp.deck_id);
    });
  });
});
