const { expect } = require("chai");
const TrelloApi = require("../../src/Trello-api");
const guard = require("../../utils/guard");
const factory = require("../../src/factory/trello-factory");
const validateJsonSchema = require('../../utils/jsonSchemaValidator');

// JSON Schemas
const createBoardSchema = require('../../schemas/trello/createBoardSchema.json');

// Initializing TrelloApi instances for authenticated and unauthenticated use
let api;
let unAuthApi;

// Setup to be performed once before all tests
before(() => {
  // Creating an authenticated instance
  api = new TrelloApi();
  api.authenticate();

  // Creating an unauthenticated instance
  unAuthApi = new TrelloApi();
});

// Test cleanup tasks to be performed after each test
afterEach(async () => {
  // Retrieving boards with a specific description prefix for cleanup
  const boardsToBeDeleted = await api.getAllBoards({
    desc: factory.qaPrefix,
  });

  // Deleting each board in parallel
  await Promise.all(
    boardsToBeDeleted.map((board) => {
      return api.deleteBoard(board.id);
    })
  );
});

/**
 * Test Suite: Trello boards api tests
 *
 * Purpose:
 * This describe block contains different suites with test cases to verify Trello boards api.
 * I added set of positive/negative scenarios to ensure the reliability of CRUD operations.
 * The test cases cover verifications of different errors as well as few edge cases
 */
describe("Trello boards api tests (/boards)", () => {
  let createBoardResponse;

  describe("Create board (POST /boards)", () => {
    it("Can create a board", async () => {
      const payload = {
        name: "New Board",
        defaultLists: "false",
        prefs_permissionLevel: "public",
        prefs_comments: "public",
        prefs_background: "sky",
        desc: `${factory.qaPrefix}This is happy path for creating board`,
      };
      const createBoardResp = await api.createBoard(payload);
      const isSchemaValid = validateJsonSchema(createBoardResp, createBoardSchema);

      expect(isSchemaValid).to.be.true;
      expect(Object.keys(createBoardResp).length).to.equal(13);
      expect(createBoardResp).to.have.property("id").that.is.a("string");
      expect(createBoardResp).to.have.property("name", payload.name);
      expect(createBoardResp).to.have.property("desc", payload.desc);
      expect(createBoardResp.prefs).to.have.property("background", payload.prefs_background);
      expect(createBoardResp.prefs).to.have.property("comments", payload.prefs_comments);
      expect(createBoardResp.prefs).to.have.property(
        "permissionLevel",
        payload.prefs_permissionLevel
      );
    });

    describe("(DD) Can create board using different background colors", () => {
      const boardBackgroundTestScenarios = ["red", "green", "orange", "sky", "blue", "grey"];

      boardBackgroundTestScenarios.forEach((color) => {
        it(`(DD) Background color: ${color}`, async () => {
          const payload = {
            ...factory.board(),
            prefs_background: color,
          };
          const createBoardResponse = await api.createBoard(payload);

          expect(createBoardResponse).to.have.property("id").that.is.a("string");
          expect(createBoardResponse).to.have.property("name", payload.name);
          expect(createBoardResponse.prefs).to.have.property("background", color);
        });
      });
    });

    it("Error is returned on create board call with invalid backgound color", async () => {
      const payload = {
        ...factory.board(),
        prefs_background: "burnt steak",
      };
      // Even though api returns error, afterEach hook still kicks in and deletes random board
      // Confirmed from postman that a random board gets added despite the error message
      const error = await guard(async () => api.createBoard(payload));

      expect(error).to.have.property("statusCode", 500);
      expect(error).to.have.property("error", "Internal Server Error");
    });

    it("Error returned when creating a board and required prop(Board name) length is 0)", async () => {
      const payload = {
        ...factory.board(),
        name: "",
      };
      const errorResp = await guard(async () => api.createBoard(payload));

      expect(errorResp).to.have.property("statusCode", 400);
      expect(errorResp).to.have.property("message", '400 - {"message":"invalid value for name","error":"ERROR"}');
    });

    it("Can create new board with previously created board name", async () => {
      const createBoardResponse = await api.createBoard(factory.board());
      const payload = {
        ...factory.board(),
        name: createBoardResponse.name,
      };
      const createBoardResp = await api.createBoard(payload);

      expect(createBoardResp).to.have.property("id", createBoardResp.id);
      expect(createBoardResp).to.have.property("name", payload.name);
    });

    describe("(DD) Can create board using different name and description lengths", () => {
      const boardNameDescLengthTestScenarios = [
        factory.minStringLength,
        factory.avgStringLength,
        factory.maxStringLength,
      ];

      boardNameDescLengthTestScenarios.forEach((randomString) => {
        it(`(DD) Board name and desc length: ${randomString.length} chars`, async () => {
          const payload = {
            ...factory.board(),
            name: randomString,
            desc: randomString,
          };
          const createBoardResponse = await api.createBoard(payload);

          expect(createBoardResponse).to.have.property("id").that.is.a("string");
          expect(createBoardResponse).to.have.property("name", randomString);
          expect(createBoardResponse).to.have.property("desc", randomString);
        });
      });
    });

    it("Error is returned when sending create call using un-auth user", async () => {
      const error = await guard(async () => unAuthApi.createBoard(factory.board()));

      expect(error).to.have.property("statusCode", 401);
      expect(error).to.have.property("error", "unauthorized permission requested");
    });

    describe('(DD) Error is returned when creating a board with invalid "name" prop length', () => {
      const boardNameLengthTestScenarios = [
        factory.maxStringLength.concat(factory.generateString(1)),
        factory.maxStringLength.concat(factory.generateString(1000)),
        "",
      ];

      boardNameLengthTestScenarios.forEach((randomString) => {
        it(`(DD) Invalid name length: ${randomString.length} chars`, async () => {
          const payload = {
            ...factory.board(),
            name: randomString,
          };
          const error = await guard(async () => api.createBoard(payload));

          expect(error).to.have.property("statusCode", 400);
          expect(error.error).to.have.property("message", "invalid value for name");
        });
      });
    });
  });

  describe("Get board (GET /boards/:boardId)", () => {

    beforeEach(async () => {
      createBoardResponse = await api.createBoard(factory.board());
    });

    it("Can get single board by ID", async () => {
      const getBoardResponse = await api.getBoard(createBoardResponse.id);

      expect(getBoardResponse).to.be.an("object");
      expect(getBoardResponse).to.have.property("id", createBoardResponse.id);
      expect(getBoardResponse)
        .to.have.property("name", createBoardResponse.name)
        .that.is.a("string");
      expect(getBoardResponse).to.have.property("desc").that.is.a("string");
    });

    it("Error is returned when sending get call using invalid board ID", async () => {
      const error = await guard(async () => api.getBoard(createBoardResponse.id.slice(2)));

      expect(error).to.have.property("statusCode", 400);
      expect(error).to.have.property("error", "invalid id");
    });

    it("Error is returned when sending get call without board ID", async () => {
      const error = await guard(async () => api.getBoard());

      expect(error).to.have.property("statusCode", 400);
      expect(error).to.have.property("error", "invalid id");
    });

    it.skip("BUG: Error is returned when sending get call using un-auth user", async () => {
      // BUG FOUND : Un-Auth user can GET any board by ID. Confirmed in Postman.
      const error = await guard(async () => unAuthApi.getBoard(createBoardResponse.id)); // Returns board
      //const postError = await guard(async () => unAuthApi.createBoard(factory.board())); // Returns error

      expect(error).to.have.property("statusCode", 401);
      expect(error).to.have.property("error", "invalid key");
    });
  });

  describe("Get all boards (GET /1/members/{id}/boards))", () => {
    it("Can get all boards associated with a user", async () => {
      // Generate an array of 10 slots and map over generated boards
      const boardsArray = Array(10).fill(10).map(() => factory.board());
      // Asynchronously create all boards using values from boardsArray
      await Promise.all(boardsArray.map(board => api.createBoard(board)));
      const getAllBoardsResp = await api.getAllBoards();

      expect(getAllBoardsResp).to.be.an("array").that.has.lengthOf(10);
      for (const board of getAllBoardsResp) {
        expect(board).to.have.property("id").that.is.a("string");
        expect(board).to.have.property("name").that.is.a("string");
        expect(board).to.have.property("desc").that.is.a("string");
      }
    });

    it("Can filter a list of boards by board prop(s)", async () => {
      const boardName = "QA Engineer";
      const boardDesc = `Deleted code is debugged code.`;
      const boardInfo = {
        ...factory.board(),
        name: `${boardName}`,
        desc: `${boardDesc}`,
      };
      const createBoardResponse = await api.createBoard(boardInfo);
      const getAllBoardsResp = await api.getAllBoards({
        name: `${boardName}`,
        desc: `${boardDesc}`,
      });

      expect(getAllBoardsResp[0]).to.have.property("id", createBoardResponse.id);
      expect(getAllBoardsResp[0]).to.have.property("name", boardName);
      expect(getAllBoardsResp[0]).to.have.property("desc", createBoardResponse.desc);
    });

    it("Empty array of boards is returned when user doesn't have any boards", async () => {
      const getAllBoardsResp = await api.getAllBoards();

      expect(getAllBoardsResp).to.be.an("array").that.is.empty;
    });
  });

  describe("Update board (UPDATE /boards/:boardId)", () => {
    beforeEach(async () => {
      createBoardResponse = await api.createBoard(factory.board());
    });

    it("Can update board props by using board ID", async () => {
      const payload = {
        ...factory.board(),
        name: "QA Engineer Responsibilities",
        desc: "n/a",
      };
      const updateBoardResponse = await api.updateBoard(createBoardResponse.id, payload);

      expect(updateBoardResponse).to.have.property("id", createBoardResponse.id);
      expect(updateBoardResponse).to.have.property("name", payload.name);
      expect(updateBoardResponse).to.have.property("desc", payload.desc);
    });

    it("Error is returned when attempting to update previously deleted board", async () => {
      await api.deleteBoard(createBoardResponse.id, true);
      const boardUpdateInfo = {
        ...factory.board(),
        name: "newUpdatedName",
      };
      const error = await guard(async () =>
        api.updateBoard(createBoardResponse.id, boardUpdateInfo)
      );

      expect(error).to.have.property("statusCode", 404);
      expect(error).to.have.property("error", "The requested resource was not found.");
    });

    describe("(DD) Can update board using different board name lengths", () => {
      const boardNameLengthTestScenarios = [
        factory.maxStringLength,
        factory.avgStringLength,
        factory.minStringLength,
      ];

      boardNameLengthTestScenarios.forEach((boardName) => {
        it(`(DD) Board name length: ${boardName.length} chars`, async () => {
          const payload = {
            ...factory.board(),
            name: boardName,
          };
          const updateBoardResponse = await api.updateBoard(createBoardResponse.id, payload);

          expect(updateBoardResponse).to.have.property("id", createBoardResponse.id);
          expect(updateBoardResponse)
            .to.have.property("name", boardName)
            .that.has.lengthOf(boardName.length);
        });
      });
    });

    it.skip("Error is returned when user updates private board", async () => {
      // Response comes with different status codes 200/400. Research what is the issue
      const createBoardPayload = {
        ...factory.board(),
        prefs_permissionLevel: "private",
      };
      const createBoardResponse = await api.createBoard(createBoardPayload);
      const updateBoardPayload = {
        ...factory.board(),
        name: "new updated name",
      };
      const error = await guard(async () =>
        api.updateBoard(createBoardResponse.id, updateBoardPayload, true)
      );

      expect(error).to.have.property("StatusCodeError", `400 - "board is not public"`);
    });
  });

  describe("Delete board (DELETE /boards/:boardId)", () => {
    beforeEach(async () => {
      createBoardResponse = await api.createBoard(factory.board());
    });

    it("Can delete single board by ID", async () => {
      const deleteBoardResponse = await api.deleteBoard(createBoardResponse.id, true);

      expect(deleteBoardResponse).to.have.property("statusCode", 200);
      expect(deleteBoardResponse).to.have.property("statusMessage", "OK");
      expect(deleteBoardResponse).to.have.property("body").that.is.eql({ _value: null });
    });

    it("Error is returned when trying to delete previosly deleted board", async () => {
      await api.deleteBoard(createBoardResponse.id, true);
      const error = await guard(async () => api.deleteBoard(createBoardResponse.id));

      expect(error).to.have.property("statusCode", 404);
      expect(error).to.have.property("error", "The requested resource was not found.");
    });

    it("Error is returned when trying to get previously deleted board", async () => {
      await api.deleteBoard(createBoardResponse.id, true);
      const error = await guard(async () => await api.getBoard(createBoardResponse.id));

      expect(error).to.have.property("statusCode", 404);
      expect(error).to.have.property("error", "The requested resource was not found.");
    });

    it("Error is returned when sending delete call using un-auth user", async () => {
      const error = await guard(async () => unAuthApi.deleteBoard(createBoardResponse.id, true));

      expect(error).to.have.property("statusCode", 401);
      expect(error).to.have.property("error", "unauthorized permission requested");
    });
  });
});
