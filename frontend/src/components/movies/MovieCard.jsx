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
import { useIsMobile } from "@/hooks/use-mobile"; // Import the hook

const MovieCard = ({ movie, isFavorite = false }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile(); // Use the hook to detect mobile screens

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
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted shadow-md">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted-foreground/20"></div>
            </div>
          )}

          <img
            src={movie.poster || `/placeholder.svg?height=300&width=200`}
            alt={movie.title}
            className={cn(
              "h-full w-full object-cover transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Overlay - Always show basic info on mobile */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300",
              isMobile ? "opacity-100" : isHovered ? "opacity-100" : "opacity-0"
            )}
          ></div>

          {/* Content - Always show title and rating on mobile */}
          <div
            className={cn(
              "absolute bottom-0 w-full p-2 transform transition-all duration-300 sm:p-3",
              isMobile
                ? "opacity-100 translate-y-0"
                : isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            )}
          >
            <h3 className="mb-1 text-sm font-bold text-white line-clamp-1 sm:text-base">
              {movie.title}
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div
                  className={cn(
                    "flex items-center gap-0.5 rounded-full px-1 py-0.5",
                    getRatingColor(movie.rating)
                  )}
                >
                  <Star size={10} className="fill-current sm:h-3 sm:w-3" />
                  <span className="text-[10px] font-medium sm:text-xs">
                    {movie.rating.toFixed(1)}
                  </span>
                </div>

                {isMobile && (
                  <div className="flex items-center gap-0.5 text-white/80 ml-1">
                    <Calendar size={10} className="sm:h-3 sm:w-3" />
                    <span className="text-[10px] font-medium sm:text-xs">
                      {movie.releaseYear}
                    </span>
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFavoriteToggle}
                className={cn(
                  "rounded-full p-1",
                  isFavorite
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/30 text-white hover:bg-white/40"
                )}
              >
                <Heart
                  size={12}
                  className={isFavorite ? "fill-current sm:h-3 sm:w-3" : "sm:h-3 sm:w-3"}
                />
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
