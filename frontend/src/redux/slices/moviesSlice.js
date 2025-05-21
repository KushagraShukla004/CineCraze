import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { moviesApi } from "@/lib/api";

// Async thunks
export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (params, { rejectWithValue }) => {
    try {
      const response = await moviesApi.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch movies");
    }
  }
);

export const fetchPopularMovies = createAsyncThunk(
  "movies/fetchPopular",
  async ({ page = 1 } = {}, { rejectWithValue }) => {
    try {
      const response = await moviesApi.getPopular({ page });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch popular movies" }
      );
    }
  }
);

export const fetchTrendingMovies = createAsyncThunk(
  "movies/fetchTrending",
  async ({ page = 1 } = {}, { rejectWithValue }) => {
    try {
      const response = await moviesApi.getTrending({ page });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch trending movies" }
      );
    }
  }
);

export const fetchMovieDetails = createAsyncThunk(
  "movies/fetchMovieDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await moviesApi.getDetails(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch movie details"
      );
    }
  }
);

const initialState = {
  movies: {
    results: [],
    page: 1,
    totalPages: 0,
    isLoading: false,
    error: null,
  },
  popularMovies: {
    results: [],
    isLoading: false,
    error: null,
  },
  trendingMovies: {
    results: [],
    isLoading: false,
    error: null,
  },
  movieDetails: {
    movie: null,
    isLoading: false,
    error: null,
  },
};

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    clearMovies: (state) => {
      state.movies.results = [];
      state.movies.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Movies
      .addCase(fetchMovies.pending, (state) => {
        state.movies.isLoading = true;
        state.movies.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        const { results, page, totalPages } = action.payload;

        // If it's the first page, replace the results
        // Otherwise, append to existing results
        if (page === 1) {
          state.movies.results = results;
        } else {
          // Filter out duplicates when appending
          const existingIds = new Set(state.movies.results.map((movie) => movie.id));
          const newMovies = results.filter((movie) => !existingIds.has(movie.id));
          state.movies.results = [...state.movies.results, ...newMovies];
        }

        state.movies.page = page;
        state.movies.totalPages = totalPages;
        state.movies.isLoading = false;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.movies.isLoading = false;
        state.movies.error = action.payload;
      })

      // Fetch Popular Movies
      .addCase(fetchPopularMovies.pending, (state) => {
        state.popularMovies.isLoading = true;
        state.popularMovies.error = null;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.popularMovies.results = action.payload.results;
        state.popularMovies.isLoading = false;
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.popularMovies.isLoading = false;
        state.popularMovies.error = action.payload;
      })

      // Fetch Trending Movies
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.trendingMovies.isLoading = true;
        state.trendingMovies.error = null;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.trendingMovies.results = action.payload.results;
        state.trendingMovies.isLoading = false;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.trendingMovies.isLoading = false;
        state.trendingMovies.error = action.payload;
      })

      // Fetch Movie Details
      .addCase(fetchMovieDetails.pending, (state) => {
        state.movieDetails.isLoading = true;
        state.movieDetails.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.movieDetails.movie = action.payload.movie;
        state.movieDetails.isLoading = false;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.movieDetails.isLoading = false;
        state.movieDetails.error = action.payload;
      });
  },
});

export const { clearMovies } = moviesSlice.actions;

export default moviesSlice.reducer;
