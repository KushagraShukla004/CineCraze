const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    movieId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    poster: String,
    releaseYear: String,
    rating: Number,
    genres: [Number],
    overview: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Favorite", favoriteSchema);
