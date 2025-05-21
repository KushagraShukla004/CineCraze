/* eslint-disable no-unused-vars */
import { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import { saveScrollPosition } from "@/redux/slices/uiSlice";
import { useLocation } from "react-router-dom";
import { transformMovieData } from "@/lib/utils";
import { Film } from "lucide-react";

const MovieGrid = ({ movies, isLoading, hasMore, onLoadMore, favorites = [] }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const observerTarget = useRef(null);

  // Save scroll position when unmounting
  useEffect(() => {
    return () => {
      dispatch(
        saveScrollPosition({
          key: location.key,
          position: window.scrollY,
        })
      );
    };
  }, [dispatch, location.key]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!isLoading && hasMore) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            onLoadMore();
          }
        },
        { threshold: 0.1 }
      );
      // Store the current value of the ref in order to avoid stale values
      const currentObserverTarget = observerTarget.current;

      if (observerTarget.current) {
        observer.observe(observerTarget.current);
      }

      return () => {
        if (currentObserverTarget) {
          observer.unobserve(currentObserverTarget);
        }
      };
    }
  }, [isLoading, hasMore, onLoadMore]);

  // Check if a movie is in favorites
  const isFavorite = (movieId) => {
    return favorites.some((fav) => fav.id === movieId);
  };

  // If loading and no movies yet, show a full grid of skeletons
  if (isLoading && movies.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <MovieCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Empty state when no movies found and not loading
  if (!isLoading && movies.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <Film className="mb-4 h-16 w-16 text-muted-foreground" />
        <h3 className="mb-2 text-xl font-bold">No movies found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filter criteria
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {/* Movie Cards with staggered animation */}
      {movies.map((movie, index) => (
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <MovieCard
            movie={transformMovieData(movie)}
            isFavorite={isFavorite(movie.id)}
          />
        </motion.div>
      ))}

      {/* Loading Skeletons at the bottom when loading more */}
      {isLoading && movies.length > 0 && (
        <>
          {Array.from({ length: 5 }).map((_, index) => (
            <MovieCardSkeleton key={`bottom-skeleton-${index}`} />
          ))}
        </>
      )}

      {/* Infinite Scroll Observer */}
      {hasMore && !isLoading && <div ref={observerTarget} className="h-20 w-full"></div>}
    </div>
  );
};

export default MovieGrid;
