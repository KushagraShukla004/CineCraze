const tmdb = require("../config/tmdb");
const redisClient = require("../config/redis");

// Cache TTL in seconds
const CACHE_TTL = {
  GENRES: 24 * 60 * 60, // 24 hours for genres (rarely change)
  MOVIE_DETAILS: 12 * 60 * 60, // 12 hours for movie details
  TRENDING: 30 * 60, // 30 minutes for trending
  POPULAR: 1 * 60 * 60, // 1 hour for popular
  SEARCH: 15 * 60, // 15 minutes for search results
};

// Helper function to get cached data
const getCachedData = async (key) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

// Helper function to set cached data
const setCachedData = async (key, data, ttl) => {
  await redisClient.setEx(key, ttl, JSON.stringify(data));
};

// Helper function to generate cache key
const generateCacheKey = (endpoint, params) => {
  const sortedParams = Object.entries(params || {})
    .filter(([_, value]) => value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join("|");
  return `movies:${endpoint}${sortedParams ? `:${sortedParams}` : ""}`;
};

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

// 2. Get trending movies: GET /api/movies/trending with caching enabled
const getTrendingMovies = async (req, res) => {
  try {
    const { time_window = "day", page = 1 } = req.query;

    if (!["day", "week"].includes(time_window)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time window. Use 'day' or 'week'",
      });
    }

    const cacheKey = generateCacheKey("trending", { time_window, page });
    const cachedData = await getCachedData(cacheKey);

    if (cachedData) {
      return res.json({ success: true, cached: true, ...cachedData });
    }

    const { data } = await tmdb.get(`/trending/movie/${time_window}`, {
      params: { page },
    });

    const results = data.results.map((m) => ({
      id: m.id,
      title: m.title,
      overview: m.overview,
      genres: m.genre_ids,
      backdrop: m.backdrop_path
        ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
        : null,
      poster: m.poster_path
        ? `https://image.tmdb.org/t/p/original${m.poster_path}`
        : null,
      releaseYear: m.release_date ? m.release_date.split("-")[0] : "N/A",
      rating: m.vote_average,
    }));

    const responseData = {
      timeWindow: time_window,
      page: data.page,
      totalPages: data.total_pages,
      results,
    };

    await setCachedData(cacheKey, responseData, CACHE_TTL.TRENDING);
    res.json({ success: true, cached: false, ...responseData });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch trending movies" });
  }
};

// 3. Get popular movies: GET /api/movies/popular with caching enabled
const getPopularMovies = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const cacheKey = generateCacheKey("popular", { page });
    const cachedData = await getCachedData(cacheKey);

    if (cachedData) {
      return res.json({ success: true, cached: true, ...cachedData });
    }

    const { data } = await tmdb.get("/movie/popular", { params: { page } });

    const results = data.results.map((m) => ({
      id: m.id,
      title: m.title,
      genres: m.genre_ids,
      overview: m.overview,
      poster: m.poster_path
        ? `https://image.tmdb.org/t/p/original${m.poster_path}`
        : null,
      releaseYear: m.release_date ? m.release_date.split("-")[0] : "N/A",
      rating: m.vote_average,
      popularityScore: m.popularity,
    }));

    const responseData = {
      page: data.page,
      totalPages: data.total_pages,
      results,
    };

    await setCachedData(cacheKey, responseData, CACHE_TTL.POPULAR);
    res.json({ success: true, cached: false, ...responseData });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch popular movies" });
  }
};

// 4. Get all genres list: GET /api/movies/genres with caching enabled
const getGenres = async (req, res) => {
  try {
    const cacheKey = "movies:genres";
    const cachedData = await getCachedData(cacheKey);

    if (cachedData) {
      return res.json({ success: true, cached: true, genres: cachedData });
    }

    const { data } = await tmdb.get("/genre/movie/list");
    await setCachedData(cacheKey, data.genres, CACHE_TTL.GENRES);

    res.json({ success: true, cached: false, genres: data.genres });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch genres" });
  }
};

// 5. Get all Movie details with their trailer: GET /api/movies/details/:id with caching enabled
const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `movies:details:${id}`;
    const cachedData = await getCachedData(cacheKey);

    if (cachedData) {
      return res.json({ success: true, cached: true, movie: cachedData });
    }

    const { data } = await tmdb.get(`/movie/${id}`, {
      params: { append_to_response: "videos,credits" },
    });

    const trailers = (data.videos.results || [])
      .filter((v) => v.type === "Trailer" && v.site === "YouTube")
      .map((v) => ({ name: v.name, url: `https://www.youtube.com/watch?v=${v.key}` }));

    const cast = (data.credits.cast || []).slice(0, 5).map((a) => ({
      name: a.name,
      character: a.character,
      profile: a.profile_path ? `https://image.tmdb.org/t/p/w300${a.profile_path}` : null,
    }));

    const movieData = {
      id: data.id,
      title: data.title,
      synopsis: data.overview,
      genres: data.genres.map((g) => g.name),
      rating: data.vote_average,
      releaseDate: data.release_date,
      backdrop: data.backdrop_path
        ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
        : null,
      poster: data.poster_path
        ? `https://image.tmdb.org/t/p/original${data.poster_path}`
        : null,
      trailers,
      cast,
    };

    await setCachedData(cacheKey, movieData, CACHE_TTL.MOVIE_DETAILS);
    res.json({ success: true, cached: false, movie: movieData });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch details" });
  }
};

module.exports = {
  getAllMovies,
  getPopularMovies,
  getMovieDetails,
  getGenres,
  getTrendingMovies,
};
