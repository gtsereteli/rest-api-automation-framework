const { expect } = require("chai");
const Api = require("../../src/GithubUser-api");

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
 * This describe block contains a test case that validates the GitHub User API's ability
 * to retrieve user information based on a specific GitHub username. The test case verifies
 * that the returned user information has the expected properties and values.
 */
describe("Can get GitHub user info", function () {
  it("Can get user by username", async function () {
    const username = "gtsereteli";
    const response = await api.getUser(username);

    expect(response).to.have.property("id").that.is.a("number");
    expect(response).to.have.property("login", username);
    expect(response).to.have.property("name", "Giorgi Tsereteli");
    expect(response).to.have.property("type", "User");
    expect(response).to.have.property("site_admin", false);
  });
});
