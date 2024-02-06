const { expect } = require("chai");
const Api = require("../../src/GithubUser-api");
const validateJsonSchema = require('../../utils/jsonSchemaValidator');

// JSON shchemas
const getUserSchema = require('../../schemas/github/getGithubUserShema.json');

// Variable to hold the instance of the Api class
let api;

// Setting up the instance of the Api class before running the tests
before(() => {
  api = new Api();
});

/**
 * Test Suite: Can get GitHub user info
 *
 * Purpose:
 * This test case validates the GitHub User API's ability
 * to retrieve correct user information based on a specific GitHub username
 */
describe("Can get GitHub user data (GET /users/:username", function () {
  it("Can get user by username", async function () {
    const username = "gtsereteli";
    const response = await api.getUser(username);
    const isSchemaValid = validateJsonSchema(response, getUserSchema);

    expect(isSchemaValid).to.be.true;
    expect(response).to.have.property("login", username);
    expect(response).to.have.property("name", "Giorgi Tsereteli");
    expect(response).to.have.property("type", "User");
    expect(response).to.have.property("site_admin", false);
  });
});
