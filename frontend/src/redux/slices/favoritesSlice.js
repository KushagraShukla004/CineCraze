import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { favoritesApi } from "@/lib/api";

// Async thunks
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const response = await favoritesApi.getAll();
      return response.data.favorites;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch favorites"
      );
    }
  }
);

export const addFavorite = createAsyncThunk(
  "favorites/addFavorite",
  async (movie, { rejectWithValue }) => {
    try {
      const movieData = {
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster,
        releaseDate: movie.releaseYear,
        rating: movie.rating,
      };

      const response = await favoritesApi.add(movieData);
      return { ...movie, dbId: response.data.favorite._id };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add favorite");
    }
  }
);

export const removeFavorite = createAsyncThunk(
  "favorites/removeFavorite",
  async (movieId, { rejectWithValue }) => {
    try {
      await favoritesApi.remove(movieId);
      return movieId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove favorite"
      );
    }
  }
);

const initialState = {
  favorites: [],
  isLoading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload.map((fav) => ({
          id: fav.movieId,
          title: fav.title,
          poster: fav.posterPath,
          releaseYear: fav.releaseDate,
          rating: fav.rating,
          dbId: fav._id,
        }));
        state.isLoading = false;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add Favorite
      .addCase(addFavorite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favorites.push(action.payload);
        state.isLoading = false;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Remove Favorite
      .addCase(removeFavorite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(
          (favorite) => favorite.id !== action.payload
        );
        state.isLoading = false;
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
