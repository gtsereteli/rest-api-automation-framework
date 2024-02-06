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
