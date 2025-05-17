import dotenv from "dotenv";
dotenv.config();
import express, { json } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/db.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
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

connectDB();

app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port http://localhost:${PORT}`
  );
});
