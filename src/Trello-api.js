require("dotenv").config();
const request = require("request-promise");

const apiVersion = "1";

const { TRELLO_APIKEY, TRELLO_TOKEN, TRELLO_HOST } = process.env;

class Trello {
  constructor() {
    this.baseUrl = TRELLO_HOST;
    this.request = request.defaults({
      json: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

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

  createBoard(body) {
    const path = `${this.baseUrl}/${apiVersion}/boards/`;

    return this.request.post({
      url: path,
      body,
    });
  }

  getBoard(boardId) {
    const path = `${this.baseUrl}/${apiVersion}/boards/${boardId}`;

    return this.request.get({
      url: path,
    });
  }

  getAllBoards(qs = {}) {
    const path = `${this.baseUrl}/${apiVersion}/members/me/boards`;

    return this.request.get({
      url: path,
      qs: qs,
    });
  }

  updateBoard(boardId, body, resolveWithFullResponse = false) {
    const path = `${this.baseUrl}/${apiVersion}/boards/${boardId}`;

    return this.request.put({
      url: path,
      body,
      resolveWithFullResponse,
    });
  }

  deleteBoard(boardId, resolveWithFullResponse = false) {
    const path = `${this.baseUrl}/${apiVersion}/boards/${boardId}`;

    return this.request.delete({
      url: path,
      resolveWithFullResponse,
    });
  }
}

module.exports = Trello;
