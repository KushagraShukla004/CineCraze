/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";

const MovieSection = ({ title, movies, isLoading, viewAllLink }) => {
  const [visibleMovies, setVisibleMovies] = useState([]);

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
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-6 flex items-center justify-between">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold"
          >
            {title}
          </motion.h2>

          {viewAllLink && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Link
                to={viewAllLink}
                className="flex items-center text-sm font-medium text-primary hover:underline"
              >
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </div>

        {/* Movies Grid with Horizontal Scroll */}
        <div className="relative overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-4">
            {isLoading
              ? // Loading Skeletons
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="w-[200px] flex-none">
                    <MovieCardSkeleton />
                  </div>
                ))
              : // Movie Cards
                visibleMovies.map((movie, index) => (
                  <div key={movie.id} className="w-[200px] flex-none">
                    <MovieCard movie={movie} />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieSection;
