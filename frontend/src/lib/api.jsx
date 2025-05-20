import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Movies API
export const moviesApi = {
  getAll: (params) => api.get("/movies/all", { params }),
  getPopular: (params) => api.get("/movies/popular", { params }),
  getTrending: (params) => api.get("/movies/trending", { params }),
  getDetails: (id) => api.get(`/movies/details/${id}`),
  getGenres: () => api.get("/movies/genres"),
};

// Auth API
export const authApi = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getCurrentUser: () => api.get("/auth/me"),
};

// Favorites API
export const favoritesApi = {
  getAll: () => api.get("/favorites"),
  add: (movie) => api.post("/favorites", movie),
  remove: (movieId) => api.delete(`/favorites/${movieId}`),
};

export default api;
