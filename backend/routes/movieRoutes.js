const express = require("express");
const {
  getAllMovies,
  getPopularMovies,
  getGenres,
  getMovieDetails,
  getTrendingMovies,
} = require("../controllers/movieController");

const router = express.Router();

router.get("/all", getAllMovies);
router.get("/popular", getPopularMovies);
router.get("/trending", getTrendingMovies);
router.get("/genres", getGenres);
router.get("/details/:id", getMovieDetails);

module.exports = router;
