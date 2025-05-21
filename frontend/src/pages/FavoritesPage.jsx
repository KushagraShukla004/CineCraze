/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { fetchFavorites } from "@/redux/slices/favoritesSlice";
import MovieGrid from "@/components/movies/MovieGrid";
import LoadingScreen from "@/components/ui/LoadingScreen";

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const { favorites, isLoading } = useSelector((state) => state.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4 md:p-6"
    >
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold md:text-3xl">My Favorites</h1>
        </div>
        <p className="text-muted-foreground">
          {favorites.length > 0
            ? `You have ${favorites.length} favorite movies`
            : "You have no favorite movies yet"}
        </p>
      </div>

      <MovieGrid
        movies={favorites}
        isLoading={isLoading}
        hasMore={false}
        favorites={favorites}
      />

      {/* Empty State */}
      {!isLoading && favorites.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-bold">No favorites yet</h2>
          <p className="text-muted-foreground">
            Start browsing movies and add them to your favorites
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default FavoritesPage;
