/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchMovies, clearMovies } from "@/redux/slices/moviesSlice";
import { fetchGenres } from "@/redux/slices/genresSlice";
import MovieGrid from "@/components/movies/MovieGrid";
import { useDebounce } from "@/hooks/use-debounce";
import { Filter, X, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const MoviesPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { movies } = useSelector((state) => state.movies);
  const { genres } = useSelector((state) => state.genres);
  const { favorites } = useSelector((state) => state.favorites);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [yearRange, setYearRange] = useState([1900, new Date().getFullYear()]);
  const [ratingRange, setRatingRange] = useState([0, 10]);
  const [sortBy, setSortBy] = useState("popularity.desc");

  // Debounce search query to prevent excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Parse URL query parameters on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // Set states based on URL parameters
    if (params.has("search")) setSearchQuery(params.get("search"));
    if (params.has("genre")) setSelectedGenre(params.get("genre"));
    if (params.has("minYear") && params.has("maxYear")) {
      setYearRange([
        Number.parseInt(params.get("minYear")),
        Number.parseInt(params.get("maxYear")),
      ]);
    }
    if (params.has("minRating") && params.has("maxRating")) {
      setRatingRange([
        Number.parseFloat(params.get("minRating")),
        Number.parseFloat(params.get("maxRating")),
      ]);
    }
    if (params.has("sort")) setSortBy(params.get("sort"));
    if (params.has("filter") && params.get("filter") === "trending") {
      setSortBy("trending");
    }

    // Fetch genres if not already loaded
    if (!genres.length) {
      dispatch(fetchGenres());
    }
  }, [location.search, dispatch, genres.length]);

  // Update URL with current filters
  const updateUrlWithFilters = useCallback(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("search", searchQuery);
    if (selectedGenre) params.set("genre", selectedGenre);
    if (yearRange[0] !== 1900) params.set("minYear", yearRange[0].toString());
    if (yearRange[1] !== new Date().getFullYear())
      params.set("maxYear", yearRange[1].toString());
    if (ratingRange[0] !== 0) params.set("minRating", ratingRange[0].toString());
    if (ratingRange[1] !== 10) params.set("maxRating", ratingRange[1].toString());
    if (sortBy !== "popularity.desc") params.set("sort", sortBy);

    navigate(`/movies?${params.toString()}`, { replace: true });
  }, [searchQuery, selectedGenre, yearRange, ratingRange, sortBy, navigate]);

  // Fetch movies when filters change
  useEffect(() => {
    const fetchFilteredMovies = () => {
      dispatch(clearMovies());

      const params = {
        page: 1,
        search: debouncedSearchQuery,
        genre: selectedGenre,
        minYear: yearRange[0],
        maxYear: yearRange[1],
        minRating: ratingRange[0],
        maxRating: ratingRange[1],
        sort: sortBy,
      };

      dispatch(fetchMovies(params));
    };

    fetchFilteredMovies();
    updateUrlWithFilters();
  }, [
    debouncedSearchQuery,
    selectedGenre,
    yearRange,
    ratingRange,
    sortBy,
    dispatch,
    updateUrlWithFilters,
  ]);

  // Load more movies for infinite scrolling
  const handleLoadMore = () => {
    if (movies.isLoading || movies.page >= movies.totalPages) return;

    const params = {
      page: movies.page + 1,
      search: searchQuery,
      genre: selectedGenre,
      minYear: yearRange[0],
      maxYear: yearRange[1],
      minRating: ratingRange[0],
      maxRating: ratingRange[1],
      sort: sortBy,
    };

    dispatch(fetchMovies(params));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedGenre("");
    setYearRange([1900, new Date().getFullYear()]);
    setRatingRange([0, 10]);
    setSortBy("popularity.desc");
    setIsFilterOpen(false);
  };

  // Toggle filter panel
  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold md:text-3xl">Explore Movies</h1>
        <p className="text-muted-foreground">
          Discover and filter through thousands of movies
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search movies by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFilterPanel}
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            <span>Filters</span>
            {(selectedGenre ||
              yearRange[0] !== 1900 ||
              yearRange[1] !== new Date().getFullYear() ||
              ratingRange[0] !== 0 ||
              ratingRange[1] !== 10) && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                !
              </span>
            )}
          </Button>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity.desc">Most Popular</SelectItem>
              <SelectItem value="popularity.asc">Least Popular</SelectItem>
              <SelectItem value="vote_average.desc">Highest Rated</SelectItem>
              <SelectItem value="vote_average.asc">Lowest Rated</SelectItem>
              <SelectItem value="release_date.desc">Newest First</SelectItem>
              <SelectItem value="release_date.asc">Oldest First</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter Panel */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isFilterOpen ? "auto" : 0,
            opacity: isFilterOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden rounded-xl border bg-card p-4 shadow-md"
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Genre Filter */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Genre</h3>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id.toString()}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year Range Filter */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Release Year</h3>
              <div className="px-2">
                <Slider
                  value={yearRange}
                  min={1900}
                  max={new Date().getFullYear()}
                  step={1}
                  onValueChange={setYearRange}
                  className="py-4"
                />
                <div className="flex items-center justify-between text-xs">
                  <span>{yearRange[0]}</span>
                  <span>{yearRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Rating Range Filter */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Rating</h3>
              <div className="px-2">
                <Slider
                  value={ratingRange}
                  min={0}
                  max={10}
                  step={0.5}
                  onValueChange={setRatingRange}
                  className="py-4"
                />
                <div className="flex items-center justify-between text-xs">
                  <span>{ratingRange[0].toFixed(1)}</span>
                  <span>{ratingRange[1].toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Reset Filters
            </Button>
            <Button size="sm" onClick={() => setIsFilterOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Active Filters Display */}
      {(selectedGenre ||
        yearRange[0] !== 1900 ||
        yearRange[1] !== new Date().getFullYear() ||
        ratingRange[0] !== 0 ||
        ratingRange[1] !== 10) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedGenre && (
            <FilterTag
              label={`Genre: ${
                genres.find((g) => g.id.toString() === selectedGenre)?.name || "Unknown"
              }`}
              onRemove={() => setSelectedGenre("")}
            />
          )}

          {(yearRange[0] !== 1900 || yearRange[1] !== new Date().getFullYear()) && (
            <FilterTag
              label={`Year: ${yearRange[0]} - ${yearRange[1]}`}
              onRemove={() => setYearRange([1900, new Date().getFullYear()])}
            />
          )}

          {(ratingRange[0] !== 0 || ratingRange[1] !== 10) && (
            <FilterTag
              label={`Rating: ${ratingRange[0].toFixed(1)} - ${ratingRange[1].toFixed(
                1
              )}`}
              onRemove={() => setRatingRange([0, 10])}
            />
          )}

          <button
            onClick={handleResetFilters}
            className="text-xs text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Movies Grid */}
      <MovieGrid
        movies={movies.results}
        isLoading={movies.isLoading}
        hasMore={movies.page < movies.totalPages}
        onLoadMore={handleLoadMore}
        favorites={favorites}
      />
    </div>
  );
};

// Filter Tag Component
const FilterTag = ({ label, onRemove }) => (
  <div className="flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary shadow-sm">
    {label}
    <button onClick={onRemove} className="ml-1 rounded-full hover:bg-primary/20 p-0.5">
      <X size={12} />
    </button>
  </div>
);

export default MoviesPage;
