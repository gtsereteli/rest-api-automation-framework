const { expect } = require("chai");
const Api = require("../../src/SpaceStation-api.js");
const guard = require("../../utils/guard.js");
const validateJsonSchema = require('../../utils/jsonSchemaValidator.js');

// JSON Schemas
const stationLocationSchema = require('../../schemas/iss/getIssLocationSchema.json');

let api;

// Setup to be performed once before all tests
before(() => {
  api = new Api();
});

/**
 * Test Suite: Wheretheiss api tests
 *
 * Purpose:
 * This is simple example of getting current location and details of International Space
 * Station. API has few endpoints and I will expand suite with more tests on metrics
 * such as latitude, altitude and calculating location in future.
 */
describe("Where is International Space Station (GET /v1/satellites/:id)", function () {
  it("Can get current coordinates of ISS", async function () {
    const response = await guard(async () => api.getStation());
    const isSchemaValid = validateJsonSchema(response, stationLocationSchema);

    expect(isSchemaValid).to.be.true;
    expect(response).to.has.property("name", "iss");
  });
});
