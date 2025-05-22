import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrendingMovies, fetchPopularMovies } from "@/redux/slices/moviesSlice";
import MovieSection from "@/components/movies/MovieSection";
import HeroSection from "@/components/movies/HeroSection";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useIsMobile } from "@/hooks/use-mobile";

const HomePage = () => {
  const dispatch = useDispatch();
  const { trendingMovies, popularMovies } = useSelector((state) => state.movies);
  const { favorites } = useSelector((state) => state.favorites);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile(); // Use the hook to detect mobile screens

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        dispatch(fetchTrendingMovies()),
        dispatch(fetchPopularMovies()),
      ]);
      setIsLoading(false);
    };

    loadData();
  }, [dispatch]);

  // Show loading screen while fetching initial data
  if (isLoading && (!trendingMovies.results.length || !popularMovies.results.length)) {
    return <LoadingScreen />;
  }

  // Get featured movie for hero section (first trending movie)
  const featuredMovie = trendingMovies.results[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Only show on non-mobile screens */}
      {!isMobile && featuredMovie && <HeroSection movie={featuredMovie} />}

      {/* Content Sections with proper spacing - Adjust top padding on mobile */}
      <div className={`${isMobile ? "pt-4" : "py-2"} sm:py-4`}>
        {/* Trending Movies Section */}
        <MovieSection
          title="Trending Now"
          movies={trendingMovies.results}
          isLoading={trendingMovies.isLoading}
          viewAllLink="/movies?filter=trending"
          favorites={favorites}
        />

        {/* Popular Movies Section */}
        <MovieSection
          title="Popular Movies"
          movies={popularMovies.results}
          isLoading={popularMovies.isLoading}
          viewAllLink="/movies"
          favorites={favorites}
        />
      </div>
    </div>
  );
};

export default HomePage;
