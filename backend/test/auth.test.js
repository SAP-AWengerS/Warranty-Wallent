const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = require("../app");
const userModel = require("../models/user-model");

jest.mock("../models/user-model");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    it("creates a new user successfully", async () => {
      userModel.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedpassword");
      const mockUser = { username: "newuser", password: "hashedpassword", name: "New User" };
      userModel.prototype.save = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/api/v1/app/auth/signUp")
        .send({ username: "newuser", password: "password", name: "New User" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User created");
      expect(response.body.data.username).toBe("newuser");
    });

    it("returns 409 if username already exists", async () => {
      userModel.findOne.mockResolvedValue({ username: "existinguser" });

      const response = await request(app)
        .post("/api/v1/app/auth/signUp")
        .send({ username: "existinguser", password: "password", name: "Existing User" });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe("username already exists");
    });

    it("returns 400 if required fields are missing", async () => {
      const response = await request(app).post("/api/v1/app/auth/signUp").send({ username: "user" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("username or password not passed or not validated");
    });
  });


});
