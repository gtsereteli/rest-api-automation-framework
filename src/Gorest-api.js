require("dotenv").config();
const request = require("request-promise");

const prefix = "public/v2";

// Extracting necessary environment variables
const { GOREST_APIKEY, GOREST_HOST } = process.env;

// Class representing a Gorest API client
class Gorest {
  // Constructor initializes the base URL and default request options.
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

  /**
   * Method to authenticate with Gorest API using API key
   *
   * @param {string} apiKey - Gorest API key for authentication
  */
  authenticate(apiKey = GOREST_APIKEY) {
    // Updating request options with authentication details
    this.request = request.defaults({
      json: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  /**
   * Method to create a new user on Gorest
   *
   * @param {object} jsonBody - JSON body containing user details.
   *
   * @returns {Promise} - Promise representing the user creation response.
   */
  createUser(jsonBody) {
    const path = `${this.baseUrl}/${prefix}/users`;
    return this.request.post({
      url: path,
      body: jsonBody,
    });
  }


  /**
   * Method to retrieve details of a specific user
   *
   * @param {number} userId - The ID of the user to retrieve details
   *
   * @returns {Promise} - Promise representing the user details response
   */
  getUser(userId) {
    const path = `${this.baseUrl}/${prefix}/users/${userId}`;

    return this.request.get({
      url: path,
    });
  }

  /**
   * Method to retrieve details of all users
   *
   * @param {object} qs - Query parameters for the request
   *
   * @returns {Promise} - Promise representing the response with all users
   */
  getAllUsers(qs = {}) {
    const path = `${this.baseUrl}/${prefix}/users`;

    return this.request.get({
      url: path,
      qs: qs,
    });
  }

  /**
   * Method to update details of a specific user
   *
   * @param {number} userId - The ID of the user to be updated
   * @param {object} jsonBody - The updated details of the user
   *
   * @returns {Promise} - Promise representing the update response
   */
  updateUser(userId, jsonBody) {
    const path = `${this.baseUrl}/${prefix}/users/${userId}`;

    return this.request.put({
      url: path,
      body: jsonBody,
    });
  }

  /**
   * Method to delete a specific user
   *
   * @param {number} userId - The ID of the user to be deleted
   * @param {boolean} resolveWithFullResponse - Whether to resolve with full response
   *
   * @returns {Promise} - Promise representing the delete response.
   */
  deleteUser(userId, resolveWithFullResponse = false) {
    const path = `${this.baseUrl}/${prefix}/users/${userId}`;

    return this.request.delete({
      url: path,
      resolveWithFullResponse: resolveWithFullResponse,
    });
  }
}

module.exports = Gorest;
