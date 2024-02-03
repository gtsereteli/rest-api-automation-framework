const { faker } = require("@faker-js/faker");

const randomString = (length = 8) => faker.random.alphaNumeric(length);

const qaPrefix = "QATest-user";

const user = () => {
  return {
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    gender: `${faker.helpers.arrayElement(["female", "male"])}`,
    email: `${qaPrefix}${randomString()}@example.com`,
    status: `${faker.helpers.arrayElement(["active", "inactive"])}`,
  };
};

module.exports = { user, qaPrefix, randomString };
