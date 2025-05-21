/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchTrendingMovies, fetchPopularMovies } from "@/redux/slices/moviesSlice";
import HeroSection from "@/components/movies/HeroSection";
import MovieSection from "@/components/movies/MovieSection";
import LoadingScreen from "@/components/ui/LoadingScreen";

const HomePage = () => {
  const dispatch = useDispatch();
  const { trendingMovies, popularMovies } = useSelector((state) => state.movies);
  const { favorites } = useSelector((state) => state.favorites);

  useEffect(() => {
    dispatch(fetchTrendingMovies());
    dispatch(fetchPopularMovies());
  }, [dispatch]);

  // Show loading screen if both trending and popular are loading
  if (trendingMovies.isLoading && popularMovies.isLoading) {
    return <LoadingScreen />;
  }

  // Get a featured movie for the hero section
  const featuredMovie = trendingMovies.results[0] || null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <HeroSection movie={featuredMovie} />

      {/* Trending Movies Section */}
      <MovieSection
        title="Trending Movies"
        movies={trendingMovies.results}
        isLoading={trendingMovies.isLoading}
        viewAllLink="/movies?filter=trending"
        favorites={favorites} // Changed from isFavorite to favorites
      />

      {/* Popular Movies Section */}
      <MovieSection
        title="Popular Movies"
        movies={popularMovies.results}
        isLoading={popularMovies.isLoading}
        viewAllLink="/movies?sort=popularity.desc"
        favorites={favorites}
      />
    </motion.div>
  );
};

export default HomePage;
