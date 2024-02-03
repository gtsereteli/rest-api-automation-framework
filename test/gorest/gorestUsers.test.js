const { expect } = require("chai");
const UserApi = require("../../src/Gorest-api");
const guard = require("../../utils/guard");
const factory = require("../../src/factory/gorest-factory");

let api;
let unAuthApi;

before(() => {
  api = new UserApi();
  api.authenticate();
  unAuthApi = new UserApi();
});

afterEach(async () => {
  const usersToBeDeleted = await api.getAllUsers({
    email: factory.qaPrefix,
  });

  await Promise.all(
    usersToBeDeleted.map((user) => {
      return api.deleteUser(user.id);
    })
  );
});

describe("GoRest users api tests (/users)", () => {
  let createUserResponse;

  describe("Create user (POST /users)", () => {
    it("Can create user", async function () {
      const newUserInfo = {
        name: "John Doe",
        gender: "male",
        email: `${Math.random().toString(36).slice(2)}@example.com`,
        status: "active",
      };
      const createUserResp = await api.createUser(newUserInfo);

      expect(Object.keys(createUserResp).length).to.equal(5);
      expect(createUserResp).to.have.property("id").that.is.a("number");
      expect(createUserResp).to.have.property("name", newUserInfo.name);
      expect(createUserResp).to.have.property("gender", newUserInfo.gender);
      expect(createUserResp).to.have.property("status", newUserInfo.status);
    });

    const userNameTestScenarios = [
      "John",
      "John Doe",
      "hyfjrugnfhkqilofprhysuhgjtnbsyehwjwuqkdshbbtjsnwikasd",
      "Johnny Ca$h",
      "John O'",
    ];

    userNameTestScenarios.forEach(function (name) {
      it(`(DD) Can create users with different name length: char count ${name.length}`, async () => {
        const payload = {
          ...factory.user(),
          name: name,
        };
        const userCreateResponse = await api.createUser(payload);

        expect(userCreateResponse).to.have.property("name", name);
      });
    });

    it("Error is returned without auth token", async function () {
      const error = await guard(async () => unAuthApi.createUser(factory.user()));

      expect(error).to.have.property("statusCode", 401);
      expect(error.error).to.have.property("message", "Authentication failed");
    });

    it("Error returned when creating a user and all required props are missing from the request (POST /users)", async function () {
      const error = await guard(async () => api.createUser());

      expect(error).to.have.property("statusCode", 422);
      expect(error.error).to.be.an("array").that.has.lengthOf(4);
      expect(error.error).to.be.eql([
        { field: "email", message: "can't be blank" },
        { field: "name", message: "can't be blank" },
        { field: "gender", message: "can't be blank, can be male of female" }, // typo in api response where it says of
        { field: "status", message: "can't be blank" },
      ]);
    });

    it("Error is returned when creating user with previously created email", async function () {
      const payload = factory.user();
      await api.createUser(payload);
      const error = await guard(async () => api.createUser(payload));

      expect(error).to.have.property("statusCode", 422);
      expect(error.error).to.eql([{ field: "email", message: "has already been taken" }]);
    });

    it("Invalid payload props passed in user create call are being ignored", async function () {
      const userInfo = factory.user();
      const payloadWithInvalidProps = {
        ...userInfo,
        age: Math.random(30),
        jobTitle: "almost qa engineer",
      };
      const createUserResp = await api.createUser(payloadWithInvalidProps);
      delete createUserResp.id;

      expect(createUserResp, "Invalid props were found in returned response").to.eql(userInfo);
    });
  });

  describe("Get user (GET /users/:userId)", () => {
    beforeEach(async () => {
      createUserResponse = await api.createUser(factory.user());
    });

    it("Can get single user by ID", async function () {
      const getUserResponse = await api.getUser(createUserResponse.id);

      expect(getUserResponse, "Get user resp didn't match create user resp").to.eql(
        createUserResponse
      );
    });

    it("Error is returned when using invalid ID", async function () {
      const userNotFound = await guard(async () => api.getUser(123456));

      expect(userNotFound).to.have.property("statusCode", 404);
    });
  });

  describe("Get all users (GET /users)", () => {
    it("Can get last 10 users", async function () {
      await Promise.all([
        api.createUser(factory.user()),
        api.createUser(factory.user()),
        api.createUser(factory.user()),
        api.createUser(factory.user()),
        api.createUser(factory.user()),
        api.createUser(factory.user()),
        api.createUser(factory.user()),
        api.createUser(factory.user()),
        api.createUser(factory.user()),
        api.createUser(factory.user()),
        api.createUser(factory.user()),
        api.createUser(factory.user()),
      ]);
      const getAllUsersResp = await api.getAllUsers();

      expect(getAllUsersResp).to.be.an("array").that.has.lengthOf(10);

      for (const user of getAllUsersResp) {
        expect(Object.keys(user).length).to.equal(5);
        expect(user).to.have.keys(["id", "name", "email", "gender", "status"]);
      }
    });

    it("Can filter a list of users by name", async function () {
      const userName = "Jack Sparrow";
      const userInfo = {
        ...factory.user(),
        name: `${userName}`,
      };
      await api.createUser(userInfo);
      const getAllUsersResp = await api.getAllUsers({
        name: `${userName}`,
      });

      for (const user of getAllUsersResp) {
        expect(user).to.have.property("name", `${userName}`);
        expect(Object.keys(user).length).to.equal(5);
        expect(user).to.have.keys(["id", "name", "email", "gender", "status"]);
      }
    });
  });

  describe("Update user (UPDATE /users/:userId)", () => {
    beforeEach(async () => {
      createUserResponse = await api.createUser(factory.user());
    });

    it("Can update single user by ID", async function () {
      const userUpdateInfo = factory.user();
      const updateUserResponse = await api.updateUser(createUserResponse.id, userUpdateInfo);
      delete updateUserResponse.id;

      expect(
        updateUserResponse,
        "Update user response body didn't match update user request body"
      ).to.eql(userUpdateInfo);
    });

    it("Error is returned when updating using previously deleted ID", async function () {
      await api.deleteUser(createUserResponse.id);
      const error = await guard(async () => api.updateUser(createUserResponse.id, factory.user()));

      expect(error).to.have.property("statusCode", 404);
      expect(error.error).to.have.property("message", "Resource not found");
    });

    it("Different user id passed in the user update call is being ignored", async function () {
      const userUpdateInfo = factory.user();
      userUpdateInfo.id = 777;
      const updateUserResponse = await api.updateUser(createUserResponse.id, userUpdateInfo);

      expect(
        updateUserResponse.id,
        "Update user response userID didn't match create user userID"
      ).to.eql(createUserResponse.id);
    });
  });

  describe("Delete user (DELETE /users/:userId)", () => {
    beforeEach(async () => {
      createUserResponse = await api.createUser(factory.user());
    });

    it("Can delete single user by ID", async function () {
      const deleteUserResponse = await api.deleteUser(createUserResponse.id, true);

      expect(deleteUserResponse).to.have.property("statusCode", 204);
    });

    it("Error is returned when using previously deleted ID", async function () {
      await api.deleteUser(createUserResponse.id);
      const error = await guard(async () => api.deleteUser(createUserResponse.id));

      expect(error).to.have.property("statusCode", 404);
      expect(error.error).to.have.property("message", "Resource not found");
    });

    it("Error is returned when getting previously deleted ID", async function () {
      await api.deleteUser(createUserResponse.id);
      const error = await guard(async () => api.getUser(createUserResponse.id));

      expect(error).to.have.property("statusCode", 404);
      expect(error.error).to.have.property("message", "Resource not found");
    });
  });
});
