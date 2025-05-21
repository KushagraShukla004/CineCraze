/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "@/redux/slices/favoritesSlice";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const MovieCard = ({ movie, isFavorite = false }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Authentication required",
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
      dispatch(addFavorite(movie));
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="movie-card group"
    >
      <Link to={`/movies/${movie.id}`} className="block h-full">
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
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

          {/* Overlay */}
          <div className="movie-card-overlay"></div>

          {/* Content */}
          <div className="movie-card-content">
            <h3 className="mb-1 text-lg font-bold text-white">{movie.title}</h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/80">{movie.releaseYear}</span>

                <div className={cn("movie-rating", getRatingColor(movie.rating))}>
                  <Star size={14} className="fill-current" />
                  <span>{movie.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Favorite Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFavoriteToggle}
                className={cn(
                  "rounded-full p-1.5",
                  isFavorite
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/20 text-white hover:bg-white/30"
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
