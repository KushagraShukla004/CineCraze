/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Heart, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "@/redux/slices/favoritesSlice";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { transformMovieData } from "@/lib/utils";

const MovieCard = ({ movie, isFavorite = false }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { genres } = useSelector((state) => state.genres);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Get genre names from genre IDs
  const getGenreNames = (movieGenres) => {
    if (!movieGenres || !genres?.length) return [];
    return movieGenres
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter((name) => name);
  };

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to add favorites",
        variant: "destructive",
      });
      return;
    }

    if (isFavorite) {
      dispatch(removeFavorite(movie.id));
      toast({
        title: "Removed from favorites",
        description: `${movie.title} has been removed from your favorites`,
      });
    } else {
      dispatch(addFavorite(transformMovieData(movie)));
      toast({
        title: "Added to favorites",
        description: `${movie.title} has been added to your favorites`,
      });
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 7) return "movie-rating-high";
    if (rating >= 5) return "movie-rating-medium";
    return "movie-rating-low";
  };

  return (
    <motion.div
      className="movie-card group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/movies/${movie.id}`} className="block h-full">
        {/* Poster Image with improved shadow and border */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted shadow-lg border border-muted/30">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="h-16 w-16 animate-pulse rounded-full bg-muted-foreground/20"></div>
            </div>
          )}

          <img
            src={movie.poster || `/placeholder.svg?height=450&width=300`}
            alt={movie.title}
            className={cn(
              "h-full w-full object-cover transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Improved gradient overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0 md:opacity-0"
            )}
          ></div>

          {/* Content with improved typography */}
          <div
            className={cn(
              "absolute bottom-0 w-full p-4 transform transition-all duration-300",
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0 md:opacity-0"
            )}
          >
            <h3 className="mb-1 text-lg font-heading font-bold text-white line-clamp-2">
              {movie.title}
            </h3>

            {/* Genre Tags with improved styling */}
            {getGenreNames(movie.genres)?.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1">
                {getGenreNames(movie.genres)
                  .slice(0, 2)
                  .map((genre, index) => (
                    <span
                      key={index}
                      className="inline-block rounded-full bg-primary/80 px-2 py-0.5 text-xs font-medium text-primary-foreground"
                    >
                      {genre}
                    </span>
                  ))}
              </div>
            )}

            {/* Add truncated overview with improved font */}
            {movie.overview && (
              <p className="mb-2 line-clamp-2 text-sm font-sans text-white/90">
                {movie.overview}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-white/90">
                  <Calendar size={14} />
                  <span className="text-xs font-medium">{movie.releaseYear}</span>
                </div>

                <div
                  className={cn(
                    "movie-rating rounded-full px-1.5 py-0.5",
                    getRatingColor(movie.rating)
                  )}
                >
                  <Star size={14} className="fill-current" />
                  <span className="font-medium">{movie.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Favorite Button with improved styling */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFavoriteToggle}
                className={cn(
                  "rounded-full p-1.5 shadow-md",
                  isFavorite
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/30 text-white hover:bg-white/40"
                )}
              >
                <Heart size={16} className={isFavorite ? "fill-current" : ""} />
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
