const request = require("supertest");
const app = require("../app");
const userModel = require("../models/user-model");

// Mock the isAdmin middleware
jest.mock("../middleware/isAdmin", () => (req, res, next) => {
  req.user = { isAdmin: true };
  next();
});

describe("Admin Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("getAlluser", () => {
    it("fetches all users successfully", async () => {
      const mockUsers = [
        { username: "user1", email: "user1@example.com" },
        { username: "user2", email: "user2@example.com" },
      ];
      jest.spyOn(userModel, "find").mockResolvedValue(mockUsers);

      const response = await request(app).get("/api/v1/admin/getAlluser");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("All user");
      expect(response.body.users).toEqual(mockUsers);
    });

    it("returns 500 if fetching users fails", async () => {
      jest.spyOn(userModel, "find").mockResolvedValue(null);

      const response = await request(app).get("/api/v1/admin/getAlluser");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Failed to create user");
    });
  });

  describe("getOneUserByUsername", () => {
    it("returns 500 when username parameter is missing due to route mismatch", async () => {
      jest.spyOn(userModel, "findOne").mockResolvedValue(null);

      const response = await request(app).get("/api/v1/admin/getOneUserByUsername");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Failed to create user");
    });
  });

  describe("deleteOneUserByUsername", () => {
    it("returns 500 when username parameter is missing due to route mismatch", async () => {
      jest.spyOn(userModel, "findOneAndDelete").mockResolvedValue(null);

      const response = await request(app).get("/api/v1/admin/deleteOneUserByUsername");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Failed to create user");
    });
  });
});
