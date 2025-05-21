import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { moviesApi } from "@/lib/api";

export const fetchGenres = createAsyncThunk(
  "genres/fetchGenres",
  async (_, { rejectWithValue }) => {
    try {
      const response = await moviesApi.getGenres();
      return response.data.genres;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch genres");
    }
  }
);

const initialState = {
  genres: [],
  isLoading: false,
  error: null,
};

const genresSlice = createSlice({
  name: "genres",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default genresSlice.reducer;
