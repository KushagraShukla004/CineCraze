import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

import authReducer from "./slices/authSlice";
import moviesReducer from "./slices/moviesSlice";
import favoritesReducer from "./slices/favoritesSlice";
import genresReducer from "./slices/genresSlice";
import uiReducer from "./slices/uiSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "favorites", "ui"], // Only persist these reducers
};

const rootReducer = combineReducers({
  auth: authReducer,
  movies: moviesReducer,
  favorites: favoritesReducer,
  genres: genresReducer,
  ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist
    }),
});

export const persistor = persistStore(store);
