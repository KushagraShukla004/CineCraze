import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const transformMovieData = (movie) => ({
  ...movie,
  poster: movie.poster || movie.posterPath || "",
  releaseYear: movie.releaseYear || movie.releaseDate?.split("-")[0] || "",
  rating: movie.rating || 0,
  genres: movie.genres || [],
  overview: movie.overview || "",
});
