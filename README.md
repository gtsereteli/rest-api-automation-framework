# REST API Test Automation

This repository contains my own studies and tests on different public APIs. In this project I use JavaScript, Mocha, Chai and Request Promise libraries to send HTTP requests and validate api responses. I also practiced general structure and tools used in API test automation to streamline and enhance testing process. If you find examples here useful, feel free to clone repo and build on top of this framework to test your own projects as well.

## Features

- **Organized structure:** All tests, data, and API wrapper classes are oganized within dedicated directories.
- **Random data:** Project includes Faker api to creative random and flexible test data.
- **Parallel execution:** Utilize JavaScript promise concepts to send bulk requests and optimize test cleanup.
- **Public APIs:** All examples are created using public and free API endpoints for practice purpose.
- **JSON schema validation:** Along with Chai assertions, I added Ajv schema validation utilities.
- **Reporting:** Easily generate custom reports for all or certain test suites.

## How to Use

### Prerequisites

- Install Node.js and NPM

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/gtsereteli/rest-api-automation-framework.git
    ```

2. Install dependencies:

    ```bash
    npm install
    ```
3. Copy `.env-template` file and rename it to `.env`

### Running tests
1. You can run sample test for api which does not require authorization 

    ```bash
    npm run test:github
    ```
2. To run all other tests, you will need to generate key/tokens and add these to `.env` file.
In the `scripts` block of `package.json` you will find all custom commands which you can use
to quickly run different suites. You can write `npm run {command-name}` to run custom script.

### API authorization

Some of the APIs in this project require key and token. You will need to provide values in `.env` file.
You can use provided tests and APIs or build on top of this project and create tests on other endpoints.
If you want to run all scenarios present in /test you will need to create authorization for following APIs

- **Trello** : https://developer.atlassian.com/cloud/trello/guides/rest-api/authorization/
- **GoRest:** : https://gorest.co.in/consumer/login
- **GitHub Users:** : authorization not required

### Writing tests
Below is an example of making a HTTP GET request:

```js
describe("Can get GitHub user info", function () {
  it("Can get user data by username", async function () {
    const response = await request.get({
      url: `https://api.github.com/users/gtsereteli`,
      json: true,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Awesome-Octocat-App",
      },
    });
  });
});
```

### Verifying responses

In this project I used `Chai` and `Ajv` libraries for all assertions. Chai provides a set of expressive and readable assertions to verify he expected outcomes of code. Ajv helps with JSON schema validations and I added helper function in utils folder which you can use for all schema assertions.

Below is an example of Chai and Ajv assertions:

```js
describe("Can get GitHub user info", function () {
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
```
### JSON schema validation

When you know the expected Json structure, you can create schema and save it in schemas directory as `schemaName.json`.
Use free online tool such as https://transform.tools/json-to-json-schema to copy/paste json object and convert it into schema which you can then donwload and use.

Use `validateJsonSchema` function to pass api response and your schema for validation

```js
validateJsonSchema(response, getUserSchema);
```

### Test data
For test data I created factory folder and use `Faker` api to generate different data sets. It also provides methods to fetch random elements from arrays and objects. For more details, you can visit their page: https://fakerjs.dev

```js
const user = () => {
  return {
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    gender: `${faker.helpers.arrayElement(["female", "male"])}`,
    email: `${qaPrefix}${randomString()}@example.com`,
    status: `${faker.helpers.arrayElement(["active", "inactive"])}`,
  };
};
```

### Reports

I added simple `mochawesome` and `mochawesome-report-generator` libraries for creating HTML reports. You can use following flags when running mocha tests or research and add your own options for reporting.

```bash
mocha './**/*.test.js' --reporter mochawesome --reporter-options reportDir=reports
```

## Thanks for checking out my repo! 
As mentioned above, this is just practice repo and not meant for professional use. Feel free to fork and play around to learn something new and apply to your projects. If you want contribute, pull requests and questions are welcomed.
