const Favorite = require("../models/Favorite");

//1. Add movie to favorites
const addFavorite = async (req, res) => {
  try {
    const { movieId, title, posterPath, releaseDate, rating } = req.body;

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: req.user.id,
      movieId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "Movie already in favorites",
      });
    }

    const favorite = await Favorite.create({
      user: req.user.id,
      movieId,
      title,
      posterPath,
      releaseDate,
      rating,
    });

    res.status(201).json({
      success: true,
      favorite,
    });
  } catch (err) {
    console.error("addFavorite error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add favorite",
    });
  }
};

//2. Remove movie from favorites
const removeFavorite = async (req, res) => {
  try {
    const { movieId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      user: req.user.id,
      movieId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    res.json({
      success: true,
      message: `${favorite.title} is removed from Favorites `,
    });
  } catch (err) {
    console.error("removeFavorite error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to remove favorite",
    });
  }
};

//3. Get user's favorites
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id });
    res.json({
      success: true,
      favorites,
    });
  } catch (err) {
    console.error("getFavorites error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to get favorites",
    });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
};
