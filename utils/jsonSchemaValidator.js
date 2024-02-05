const Ajv = require('ajv');

/**
 * Validates a JSON object against a JSON schema.
 *
 * @param {object} json - The JSON object to be validated.
 * @param {object} schema - The JSON schema to validate against.
 *
 * @returns {boolean} - True if the JSON object is valid according to the schema, false otherwise.
 */
const validateJsonSchema = (json, schema) => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const isValid = validate(json);

  if (!isValid) {
    console.error('Validation errors:', validate.errors);
  }

  return isValid;
};

module.exports = validateJsonSchema;
