require("dotenv").config();
const request = require("request-promise");

const prefix = "public/v2";

const { GOREST_APIKEY, GOREST_HOST } = process.env;

class Gorest {
  constructor() {
    this.baseUrl = GOREST_HOST;
    this.request = request.defaults({
      json: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  authenticate(apiKey = GOREST_APIKEY) {
    this.request = request.defaults({
      json: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  createUser(jsonBody) {
    const path = `${this.baseUrl}/${prefix}/users`;
    return this.request.post({
      url: path,
      body: jsonBody,
    });
  }

  getUser(userId) {
    const path = `${this.baseUrl}/${prefix}/users/${userId}`;

    return this.request.get({
      url: path,
    });
  }

  getAllUsers(qs = {}) {
    const path = `${this.baseUrl}/${prefix}/users`;

    return this.request.get({
      url: path,
      qs: qs,
    });
  }

  updateUser(userId, jsonBody) {
    const path = `${this.baseUrl}/${prefix}/users/${userId}`;

    return this.request.put({
      url: path,
      body: jsonBody,
    });
  }

  deleteUser(userId, resolveWithFullResponse = false) {
    const path = `${this.baseUrl}/${prefix}/users/${userId}`;

    return this.request.delete({
      url: path,
      resolveWithFullResponse: resolveWithFullResponse,
    });
  }
}

module.exports = Gorest;
