const request = require("supertest");
const jwt = require("jsonwebtoken");

// Mock the google-auth-library before requiring the app
const mockVerifyIdToken = jest.fn();
jest.mock("google-auth-library", () => ({
  OAuth2Client: jest.fn(() => ({
    verifyIdToken: mockVerifyIdToken,
  })),
}));

const app = require("../app");
const User = require("../models/user-model");

jest.mock("../models/user-model");
jest.mock("jsonwebtoken");

describe.skip("Google Authentication", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signUpWithGoogle", () => {
    it("creates a new user successfully with Google authentication", async () => {
      // Mock Google token verification
      const mockPayload = {
        sub: "google123",
        email: "test@example.com",
        name: "Test User",
        picture: "https://example.com/photo.jpg"
      };

      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => mockPayload
      });

      // Mock user not existing initially
      User.findOne.mockResolvedValue(null);

      // Mock user creation
      const mockSavedUser = {
        googleId: "google123",
        email: "test@example.com",
        name: "Test User",
        isSubscribed: false,
        createdAt: new Date()
      };

      User.prototype.save = jest.fn().mockResolvedValue(mockSavedUser);
      User.mockImplementation(() => ({
        save: User.prototype.save
      }));

      // Mock JWT signing
      jwt.sign.mockReturnValue("mock-jwt-token");

      const response = await request(app)
        .post("/api/v1/app/auth/signUpWithGoogle")
        .set("Authorization", "Bearer valid-google-token")
        .send();

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(200);
      expect(response.body.message).toBe("Google authentication successful");
      expect(response.body.user.email).toBe("test@example.com");
      expect(response.body.token).toBe("mock-jwt-token");
    });

    it("authenticates existing Google user successfully", async () => {
      const mockPayload = {
        sub: "google123",
        email: "test@example.com",
        name: "Test User",
        picture: "https://example.com/photo.jpg"
      };

      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => mockPayload
      });

      // Mock existing user
      const existingUser = {
        googleId: "google123",
        email: "test@example.com",
        name: "Test User",
        isSubscribed: true
      };
      User.findOne.mockResolvedValue(existingUser);

      jwt.sign.mockReturnValue("mock-jwt-token");

      const response = await request(app)
        .post("/api/v1/app/auth/signUpWithGoogle")
        .set("Authorization", "Bearer valid-google-token")
        .send();

      expect(response.status).toBe(200);
      expect(response.body.user.isSubscribed).toBe(true);
      expect(User.prototype.save).not.toHaveBeenCalled(); // Should not create new user
    });

    it("returns 400 if no token provided", async () => {
      const response = await request(app)
        .post("/api/v1/app/auth/signUpWithGoogle")
        .send();

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Google token not provided");
    });

    it("returns 401 if Google token verification fails", async () => {
      mockVerifyIdToken.mockRejectedValue(new Error("Invalid token"));

      const response = await request(app)
        .post("/api/v1/app/auth/signUpWithGoogle")
        .set("Authorization", "Bearer invalid-google-token")
        .send();

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Google authentication failed: Invalid token");
    });

    it("returns 400 if Google payload is invalid", async () => {
      const mockPayload = {
        sub: null, // Invalid payload
        email: null,
      };

      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => mockPayload
      });

      const response = await request(app)
        .post("/api/v1/app/auth/signUpWithGoogle")
        .set("Authorization", "Bearer valid-google-token")
        .send();

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid Google token payload");
    });
  });
});
