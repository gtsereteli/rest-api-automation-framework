require("dotenv").config();
const request = require("request-promise");

// Extracting environment variables
const { GITHUB_HOST } = process.env;

// Class representing the GitHub User API wrapper
class GithubUser {
  constructor() {
    // Creating instance of 'request' with default configurations
    this.baseUrl = GITHUB_HOST;
    this.request = request.defaults({
      json: true,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Awesome-Octocat-App", // GitHub API requires a user-agent header
      },
    });
  }

  /**
   * Retrieves user information based on the provided username.
   *
   * @param {string} username - GitHub username for which to retrieve information.
   *
   * @returns {Promise<object>} A Promise that resolves to the user information object.
   */
  getUser(username) {
    const path = `${this.baseUrl}/users/${username}`;
    return this.request.get({
      url: path,
    });
  }
}

module.exports = GithubUser;
