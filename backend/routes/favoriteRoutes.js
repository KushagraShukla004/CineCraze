const express = require("express");
const {protect } = require("../middlewares/authMiddleware");
const {
  addFavorite,
  removeFavorite,
  getFavorites
} = require("../controllers/favoriteController");

const router = express.Router();

//use protect middleware in all favorite routes
router.use(protect);
router.post("/", addFavorite)
router.get("/", getFavorites);
router.delete("/:movieId",removeFavorite);

module.exports = router;