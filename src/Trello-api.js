require("dotenv").config();
const request = require("request-promise");

const apiVersion = "1";

// Extracting environment variables
const { TRELLO_APIKEY, TRELLO_TOKEN, TRELLO_HOST } = process.env;

// Class representing a Trello API client
class Trello {
  // Constructor initializes the base URL and default request options
  constructor() {
    this.baseUrl = TRELLO_HOST;
    this.request = request.defaults({
      json: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

 /**
   * Method to authenticate with Trello API using API key and token
   *
   * @param {string} apiKey - Trello API key
   * @param {string} apiToken - Trello API token
   */
  authenticate(apiKey = TRELLO_APIKEY, apiToken = TRELLO_TOKEN) {
    this.request = request.defaults({
      json: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      qs: {
        key: apiKey,
        token: apiToken,
      },
    });
  }

  /**
   * Method to create a new board
   *
   * @param {object} body - The details of the board to be created
   *
   * @returns {Promise} - Promise representing the board creation response
   */
  createBoard(body) {
    const path = `${this.baseUrl}/${apiVersion}/boards/`;

    return this.request.post({
      url: path,
      body,
    });
  }

  /**
   * Method to retrieve details of a specific board
   *
   * @param {string} boardId - The ID of the board to retrieve details
   *
   * @returns {Promise} - Promise representing the board details response
   */
  getBoard(boardId) {
    const path = `${this.baseUrl}/${apiVersion}/boards/${boardId}`;

    return this.request.get({
      url: path,
    });
  }

  /**
   * Method to retrieve all boards for the authenticated user
   *
   * @param {object} qs - Query parameters for the request
   *
   * @returns {Promise} - Promise representing the response with all boards.
   */
  getAllBoards(qs = {}) {
    const path = `${this.baseUrl}/${apiVersion}/members/me/boards`;

    return this.request.get({
      url: path,
      qs: qs,
    });
  }

  /**
   * Method to update details of a specific board
   *
   * @param {string} boardId - The ID of the board to be updated.
   * @param {object} body - The updated details of the board.
   * @param {boolean} resolveWithFullResponse - Whether to resolve with the full response.
   *
   * @returns {Promise} - Promise representing the update response.
   */
  updateBoard(boardId, body, resolveWithFullResponse = false) {
    const path = `${this.baseUrl}/${apiVersion}/boards/${boardId}`;

    return this.request.put({
      url: path,
      body,
      resolveWithFullResponse,
    });
  }

  /**
   * Method to delete a specific board
   *
   * @param {string} boardId - The ID of the board to be deleted
   * @param {boolean} resolveWithFullResponse - Whether to resolve with the full response
   *
   * @returns {Promise} - Promise representing the delete response
   */
  deleteBoard(boardId, resolveWithFullResponse = false) {
    const path = `${this.baseUrl}/${apiVersion}/boards/${boardId}`;

    return this.request.delete({
      url: path,
      resolveWithFullResponse,
    });
  }
}

module.exports = Trello;
