/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import { transformMovieData } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile"; // Import the hook

const MovieSection = ({ title, movies, isLoading, viewAllLink, favorites }) => {
  const [visibleMovies, setVisibleMovies] = useState([]);
  const isMobile = useIsMobile(); // Use the hook to detect mobile screens

  // Check if a movie is in favorites
  const isFavorite = (movieId) => {
    return favorites?.some((fav) => fav.id === movieId);
  };

  // Show movies with a staggered animation
  useEffect(() => {
    if (!isLoading && movies.length > 0) {
      const timer = setTimeout(() => {
        setVisibleMovies(movies);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isLoading, movies]);

  return (
    <section className={`py-4 ${isMobile ? "mb-2" : ""} sm:py-6`}>
      <div className="container mx-auto px-4">
        {/* Section Header - Adjust spacing for mobile */}
        <div className="mb-3 flex items-center justify-between">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${
              isMobile ? "text-xl" : "text-lg"
            } font-bold sm:text-xl md:text-2xl`}
          >
            {title}
          </motion.h2>

          {viewAllLink && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Link
                to={viewAllLink}
                className="flex items-center text-xs font-medium text-primary hover:underline sm:text-sm"
              >
                View All
                <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </motion.div>
          )}
        </div>

        {/* Movies Horizontal Scroll - Adjust card sizes for mobile */}
        <div className="relative -mx-4 px-4">
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide sm:gap-3 md:gap-4">
            {isLoading
              ? // Loading Skeletons
                Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className={`${
                      isMobile ? "w-[120px]" : "w-[110px]"
                    } flex-none sm:w-[130px] md:w-[150px] lg:w-[170px]`}
                  >
                    <MovieCardSkeleton />
                  </div>
                ))
              : // Movie Cards
                visibleMovies.map((movie, index) => (
                  <div
                    key={movie.id}
                    className={`${
                      isMobile ? "w-[120px]" : "w-[110px]"
                    } flex-none sm:w-[130px] md:w-[150px] lg:w-[170px]`}
                  >
                    <MovieCard
                      movie={transformMovieData(movie)}
                      isFavorite={isFavorite(movie.id)}
                    />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieSection;
