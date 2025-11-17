const request = require("supertest");
const app = require("../app");
const userModel = require("../models/user-model");

jest.mock("../models/user-model");

// Mock the isAuthenticated middleware
jest.mock("../middleware/isAuthenticated", () => (req, res, next) => {
  next();
});

describe("User Controller - getMyProfile", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("returns the user profile successfully when decodedUser is valid", async () => {
    const mockUser = { username: "testuser", email: "test@example.com", password: "hashedpassword" };
    userModel.findOne.mockResolvedValue(mockUser);

    const response = await request(app)
      .get("/api/v1/app/users/getMyProfile")
      .send({ decodedUser: { username: "testuser" } });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Profile found");
    expect(response.body.user).toEqual({ username: "testuser", email: "test@example.com" });
  });

  it("returns 400 if decodedUser is not provided", async () => {
    const response = await request(app).get("/api/v1/app/users/getMyProfile").send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Application id not valid");
  });

  it("returns 500 if the user is not found", async () => {
    userModel.findOne.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/v1/app/users/getMyProfile")
      .send({ decodedUser: { username: "nonexistent" } });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Cannot convert undefined or null to object");
  });
});
