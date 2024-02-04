const { faker } = require("@faker-js/faker");

const qaPrefix = "QATest";
const boardColors = ["red", "green", "orange", "sky", "blue", "grey"];
const votingPrefs = ["public", "observers", "members", "disabled", "org"];
const commentsPrefs = ["public", "observers", "members", "disabled"];

/**
 * Generates a board object with randomized properties.
 *
 * @returns {Object} - A board object with name, description, and various preferences.
 */
const board = () => {
  return {
    name: `${faker.name.fullName()}`,
    desc: `${qaPrefix}${faker.lorem.lines(1)}`,
    prefs_background: `${faker.helpers.arrayElement(boardColors)}`,
    prefs_permissionLevel: `public`,
    prefs_comments: `${faker.helpers.arrayElement(commentsPrefs)}`,
    prefs_invitations: `${faker.helpers.arrayElement(["admins", "members"])}`,
    prefs_voting: `${faker.helpers.arrayElement(votingPrefs)}`,
    defaultLists: `${faker.datatype.boolean()}`,
    prefs_selfJoin: `${faker.datatype.boolean()}`,
  };
};

// Maximum, minimum and average allowed lengths
const maxStringLength = faker.random.alpha(16384);
const avgStringLength = faker.random.alpha(8192);
const minStringLength = faker.random.alpha(1);

/**
 * Generates a random string of a specified length.
 *
 * @param {number} length - The length of the string to be generated.
 *
 * @returns {string} - A random string with the specified length.
 */
const generateString = (length) => {
  return faker.random.alpha(length);
};

module.exports = {
  board,
  qaPrefix,
  maxStringLength,
  avgStringLength,
  minStringLength,
  generateString,
};
