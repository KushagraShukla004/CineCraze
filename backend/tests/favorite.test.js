const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const Favorite = require("../models/Favorite");
const User = require("../models/User");

describe("Favorite API", () => {
  let testUserId;
  let testToken;
  let testFavorite;

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_MONGODB_URI);
    
    const user = await User.create({
      name: "Test User",
      email: "test@favorites.com",
      password: "password123"
    });
    testUserId = user._id;

    // Get auth token
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@favorites.com",
        password: "password123"
      });
    testToken = loginRes.body.token;
  });

  beforeEach(async () => {
    testFavorite = await Favorite.create({
      user: testUserId,
      movieId: 123,
      title: "Test Movie",
      posterPath: "/test.jpg",
      releaseDate: "2023-01-01",
      rating: 7.5
    });
  });

  afterEach(async () => {
    await Favorite.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/favorites", () => {
    it("should add a movie to favorites", async () => {
      const res = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          movieId: 456,
          title: "New Favorite",
          posterPath: "/new.jpg",
          releaseDate: "2023-02-01",
          rating: 8.0
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("favorite");
      expect(res.body.favorite.title).toBe("New Favorite");
    });

    it("should prevent duplicate favorites", async () => {
      const res = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          movieId: 123,
          title: "Duplicate Movie",
          posterPath: "/dup.jpg",
          releaseDate: "2023-01-01",
          rating: 7.5
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Movie already in favorites");
    });

    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/favorites")
        .send({
          movieId: 789,
          title: "Unauthorized",
          posterPath: "/unauth.jpg",
          releaseDate: "2023-03-01",
          rating: 6.5
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("DELETE /api/favorites/:movieId", () => {
    it("should remove a movie from favorites", async () => {
      const res = await request(app)
        .delete(`/api/favorites/${testFavorite.movieId}`)
        .set("Authorization", `Bearer ${testToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain("is removed from Favorites");
    });

    it("should return 404 if favorite not found", async () => {
      const res = await request(app)
        .delete("/api/favorites/999")
        .set("Authorization", `Bearer ${testToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Favorite not found");
    });
  });

  describe("GET /api/favorites", () => {
    it("should return user's favorites", async () => {
      const res = await request(app)
        .get("/api/favorites")
        .set("Authorization", `Bearer ${testToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.favorites.length).toBe(1);
      expect(res.body.favorites[0].title).toBe("Test Movie");
    });

    it("should return empty array if no favorites", async () => {
      await Favorite.deleteMany();
      const res = await request(app)
        .get("/api/favorites")
        .set("Authorization", `Bearer ${testToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.favorites.length).toBe(0);
    });
  });
});