const tmdb = require("../config/tmdb");

// 1. Get all movies: GET /api/movies/all
const getAllMovies = async (req, res) => {
  try {
    const {
      search,
      genre,
      minYear,
      maxYear,
      minRating,
      maxRating,
      sort,
      page = 1,
    } = req.query;

    // Validate ratings (range 0–10)
    if (
      (minRating && (minRating < 0 || minRating > 10)) ||
      (maxRating && (maxRating < 0 || maxRating > 10))
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Ratings must be between 0 and 10" });
    }

    // Validating year range because minYear !> maxYear
    if (minYear && maxYear && Number(minYear) > Number(maxYear)) {
      return res
        .status(400)
        .json({ success: false, message: "minYear cannot exceed maxYear" });
    }

    let endpoint, params;
    if (search) {
      // First get search results i.e., text search only (no filters!)
      endpoint = "/search/movie";
      params = { page, query: search.trim() };
    } else {
      // Use discover endpoint for non-search queries(no text search!)
      // Documentation reference : https://developer.themoviedb.org/reference/discover-movie
      endpoint = "/discover/movie";
      params = {
        page,
        sort_by: sort || "popularity.desc",
        with_genres: genre,
        "primary_release_date.gte": minYear ? `${minYear}-01-01` : undefined,
        "primary_release_date.lte": maxYear ? `${maxYear}-12-31` : undefined,
        "vote_average.gte": minRating,
        "vote_average.lte": maxRating,
      };
    }

    const { data } = await tmdb.get(endpoint, { params });

    let results = data.results.map((m) => ({
      id: m.id,
      title: m.title,
      //w500 means width = 500px
      poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
      releaseYear: m.release_date ? m.release_date.split("-")[0] : "N/A",
      rating: m.vote_average,
    }));

    // 🧑‍💻👁️ Workaround I found to discover/movie endpoint not supporting text-based searching with active filters!!
    // Applying additional filters even if there was a search query (genre filter cannot be applied TMDb does not support it)
    if (search) {
      results = results.filter((m) => {
        return (
          (!minRating || m.rating >= minRating) &&
          (!maxRating || m.rating <= maxRating) &&
          (!minYear || m.releaseYear >= minYear) &&
          (!maxYear || m.releaseYear <= maxYear) &&
          (!genre || true)
        ); // Genre filtering not available in search results
      });
    }

    res.json({
      success: true,
      page: data.page,
      totalPages: data.total_pages,
      results,
    });
  } catch (err) {
    // 404 from TMDb (e.g. invalid genre ID)
    if (err.response?.status === 404) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }
    res.status(500).json({ success: false, message: "Failed to fetch movies" });
  }
};

//2. Get popular movies: GET /api/movies/popular
const getPopularMovies = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const { data } = await tmdb.get("/movie/popular", { params: { page } });

    const results = data.results.map((m) => ({
      id: m.id,
      title: m.title,
      poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
      releaseYear: m.release_date ? m.release_date.split("-")[0] : "N/A",
      rating: m.vote_average,
    }));

    res.json({ success: true, page: data.page, totalPages: data.total_pages, results });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch popular" });
  }
};

// 3. Get all genres list: GET /api/movies/genres
const getGenres = async (req, res) => {
  try {
    const { data } = await tmdb.get("/genre/movie/list");
    res.json({ success: true, genres: data.genres });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch genres" });
  }
};

// 4. Get all Movie details with their trailer: GET /api/movies/details/:id
const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await tmdb.get(`/movie/${id}`, {
      // append_to_respone is a TMDb provided feature for "appending" multiple extra requests in one request only . For full explanation see: https://developer.themoviedb.org/docs/append-to-response
      params: { append_to_response: "videos,credits" },
    });

    const trailers = (data.videos.results || [])
      .filter((v) => v.type === "Trailer" && v.site === "YouTube")
      .map((v) => ({ name: v.name, url: `https://www.youtube.com/watch?v=${v.key}` }));

    // getting Top 5 cast members (using .slice(0,5)) then showing array of 5 cast members with their image
    const cast = (data.credits.cast || []).slice(0, 5).map((a) => ({
      name: a.name,
      character: a.character,
      profile: a.profile_path ? `https://image.tmdb.org/t/p/w300${a.profile_path}` : null,
    }));

    res.json({
      success: true,
      movie: {
        id: data.id,
        title: data.title,
        synopsis: data.overview,
        genres: data.genres.map((g) => g.name),
        rating: data.vote_average,
        releaseDate: data.release_date,
        poster: data.poster_path
          ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
          : null,
        trailers,
        cast,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch details" });
  }
};

// 5. Get trending movies: GET /api/movies/trending
const getTrendingMovies = async (req, res) => {
  try {
    const { time_window = "day", page = 1 } = req.query;

    // Validate time_window parameter
    if (!["day", "week"].includes(time_window)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time window. Use 'day' or 'week'",
      });
    }

    const { data } = await tmdb.get(`/trending/movie/${time_window}`, {
      params: { page },
    });

    const results = data.results.map((m) => ({
      id: m.id,
      title: m.title,
      poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
      releaseYear: m.release_date ? m.release_date.split("-")[0] : "N/A",
      rating: m.vote_average,
      trendingScore: m.popularity, // Include popularity score
    }));

    res.json({
      success: true,
      timeWindow: time_window,
      page: data.page,
      totalPages: data.total_pages,
      results,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch trending movies",
    });
  }
};

module.exports = {
  getAllMovies,
  getPopularMovies,
  getMovieDetails,
  getGenres,
  getTrendingMovies, // Add the new function to exports
};
