const axios = require("axios");

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 10000,
  params: {
    api_key: process.env.TMDB_API_KEY,
  },
});

module.exports = tmdb;
