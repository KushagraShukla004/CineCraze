const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { json } = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoutes");
const movieRoute = require("./routes/movieRoutes");
const favoriteRoute = require("./routes/favoriteRoutes");

const app = express();
const PORT = process.env.PORT;

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:3000", "https://cine-craze-zeta.vercel.app/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(json());

// Logging HTTP requests in "dev mode"
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// security headers in production for XSS security and so on
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

app.get("/", (req, res) => {
  res.send("CineCraze backend running");
});
app.use("/api/auth", authRoute);
app.use("/api/movies", movieRoute);
app.use("/api/favorites", favoriteRoute);

connectDB();

// Only start server if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(
      `Server running in ${
        process.env.NODE_ENV || "development"
      } mode on port http://localhost:${PORT}`
    );
  });
}

module.exports = app;
