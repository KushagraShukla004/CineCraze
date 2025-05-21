import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "./components/ui/toaster";
import { checkAuth } from "./redux/slices/authSlice";
import { fetchGenres } from "./redux/slices/genresSlice";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoadingScreen from "./components/ui/LoadingScreen";
import NavLayout from "./components/navigation/NavLayout";
//Pages
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import NotFoundPage from "./pages/NotFoundPage";
import AuthPage from "./pages/AuthPage";

// Lazy-loaded components for less frequently accessed pages
const MovieDetailPage = lazy(() => import("./pages/MovieDetailPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { scrollPositions } = useSelector((state) => state.ui);

  // Check authentication status on app load
  useEffect(() => {
    dispatch(checkAuth());
    dispatch(fetchGenres());
  }, [dispatch]);

  // Restore scroll position when navigating back
  useEffect(() => {
    const savedPosition = scrollPositions[location.key] || 0;
    setTimeout(() => window.scrollTo(0, savedPosition), 100);
  }, [location.key, scrollPositions]);

  return (
    <>
      <Routes>
        <Route path="/" element={<NavLayout />}>
          <Route index element={<HomePage />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route
            path="movies/:id"
            element={
              <Suspense fallback={<LoadingScreen />}>
                <MovieDetailPage />
              </Suspense>
            }
          />
          <Route path="auth" element={<AuthPage />} />
          <Route
            path="favorites"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingScreen />}>
                  <FavoritesPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
