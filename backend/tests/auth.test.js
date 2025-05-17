const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/User");

describe("Auth API", () => {
  let authToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_MONGODB_URI);
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "Password123",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toHaveProperty("name", "Test User");
      authToken = res.body.token; // Store token for subsequent tests
    });

    it("should not register user with invalid data", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "",
        email: "invalid-email",
        password: "123",
      });

      expect(res.statusCode).toBe(400);
    });

    it("should not register duplicate email", async () => {
      // First registration
      await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "duplicate@example.com",
        password: "Password123",
      });

      // Second registration with same email
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "duplicate@example.com",
        password: "Password123",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Email already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login user with valid credentials", async () => {
      // First register a user
      await request(app).post("/api/auth/register").send({
        name: "Login Test",
        email: "login@example.com",
        password: "Password123",
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "login@example.com",
        password: "Password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toHaveProperty("email", "login@example.com");
    });

    it("should not login with invalid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Invalid email or password");
    });
  });

  describe("GET /api/auth/me", () => {
    it("should get current user profile with valid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toHaveProperty("name", "Test User");
    });

    it("should reject request without token", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Unauthorized");
    });

    it("should reject request with invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalidtoken");

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Token invalid or expired");
    });
  });
});
