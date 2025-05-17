const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbURL =
      process.env.NODE_ENV === "test"
        ? process.env.TEST_MONGODB_URI
        : process.env.MONGODB_URI;

    await mongoose.connect(dbURL);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    console.log(
      `Database: ${process.env.NODE_ENV === "test" ? "TESTING" : "PRODUCTION"}`
    );
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
