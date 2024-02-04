const request = require("request-promise");

const baseUrl = "https://api.github.com";

// Class representing the GitHub User API wrapper
class GithubUser {
  // Constructor for initializing the GitHubUser instance
  constructor() {
    // Creating a customized instance of 'request' with default configurations
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
    const path = `${baseUrl}/users/${username}`;

    return this.request.get({
      url: path,
    });
  }
}

module.exports = GithubUser;
