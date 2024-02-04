const { faker } = require("@faker-js/faker");

const qaPrefix = "QATest";
const boardColors = ["red", "green", "orange", "sky", "blue", "grey"];

const board = () => {
  return {
    name: `${faker.name.fullName()}`,
    desc: `${qaPrefix}${faker.lorem.lines(1)}`,
    prefs_background: `${faker.helpers.arrayElement(boardColors)}`,
    prefs_permissionLevel: `public`,
    prefs_comments: `${faker.helpers.arrayElement(["public", "observers", "members", "disabled"])}`,
    prefs_invitations: `${faker.helpers.arrayElement(["admins", "members"])}`,
    prefs_voting: `${faker.helpers.arrayElement([
      "public",
      "observers",
      "members",
      "disabled",
      "org",
    ])}`,
    defaultLists: `${faker.datatype.boolean()}`,
    prefs_selfJoin: `${faker.datatype.boolean()}`,
  };
};

// These are max, mix, avg allowed lengths
const maxStringLength = faker.random.alpha(16384);
const avgStringLength = faker.random.alpha(8192);
const minStringLength = faker.random.alpha(1);
const customStringLength = (length) => {
  return faker.random.alpha(length);
};

module.exports = {
  board,
  qaPrefix,
  maxStringLength,
  avgStringLength,
  minStringLength,
  customStringLength,
};
