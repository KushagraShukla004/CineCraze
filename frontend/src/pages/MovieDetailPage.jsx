/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { fetchMovieDetails } from "@/redux/slices/moviesSlice";
import { addFavorite, removeFavorite } from "@/redux/slices/favoritesSlice";
import { useToast } from "@/hooks/use-toast";
import { transformMovieData } from "@/lib/utils";
import {
  Star,
  Calendar,
  Clock,
  ArrowLeft,
  Play,
  ChevronDown,
  Plus,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LoadingScreen from "@/components/ui/LoadingScreen";
import YouTubeEmbed from "@/components/movies/YouTubeEmbed";

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { movieDetails } = useSelector((state) => state.movies);
  const { favorites } = useSelector((state) => state.favorites);
  const [activeTab, setActiveTab] = useState("overview");
  const [isBackdropLoaded, setIsBackdropLoaded] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const pageRef = useRef(null);
  const headerRef = useRef(null);

  // Parallax effect for backdrop
  const { scrollY } = useScroll();
  const backdropY = useTransform(scrollY, [0, 500], [0, 150]);
  const headerOpacity = useTransform(scrollY, [0, 100, 200], [0, 0.5, 1]);

  // Check if movie is in favorites
  const isFavorite = favorites.some((fav) => fav.id === Number.parseInt(id));

  // Fetch movie details on component mount
  useEffect(() => {
    dispatch(fetchMovieDetails(id));
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [dispatch, id]);

  // Track scroll position for header effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to add favorites",
        variant: "destructive",
      });
      return;
    }

    if (isFavorite) {
      dispatch(removeFavorite(Number.parseInt(id)));
      toast({
        title: "Removed from favorites",
        description: `${movieDetails.movie?.title} has been removed from your favorites`,
      });
    } else {
      // Ensure we're sending genre IDs (numbers) not names
      const favoriteData = {
        ...movieDetails.movie,
        genres: movieDetails.movie.genre_ids || movieDetails.movie.genres.map(g => g.id)
      };
      dispatch(addFavorite(favoriteData));
      toast({
        title: "Added to favorites",
        description: `${movieDetails.movie?.title} has been added to your favorites`,
      });
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Get trailer URL from movie data
  const getTrailerUrl = () => {
    if (!movieDetails.movie?.trailers || movieDetails.movie.trailers.length === 0) {
      return null;
    }

    const trailer = movieDetails.movie.trailers[0];
    if (!trailer.url) return null;

    // Extract video ID from YouTube URL
    const urlPattern = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
    const match = trailer.url.match(urlPattern);
    return match ? match[1] : null;
  };

  // Show loading screen while fetching movie details
  if (movieDetails.isLoading || !movieDetails.movie) {
    return <LoadingScreen />;
  }

  const { movie } = movieDetails;
  const trailerVideoId = getTrailerUrl();
  const hasTrailer = !!trailerVideoId;

  return (
    <div ref={pageRef} className="relative min-h-screen pb-12 bg-background">
      {/* Floating header that appears on scroll */}
      <motion.header
        ref={headerRef}
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-300"
      >
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-lg font-bold truncate max-w-[200px] md:max-w-md">
              {movie.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {hasTrailer && (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => setShowTrailer(true)}
              >
                <Play size={16} className="mr-2" />
                Trailer
              </Button>
            )}

            <Button
              variant={isFavorite ? "default" : "outline"}
              size="icon"
              onClick={handleFavoriteToggle}
              className="rounded-full"
            >
              {isFavorite ? <Check size={18} /> : <Plus size={18} />}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Full-screen backdrop with parallax effect */}
      <div className="relative h-[100vh] w-full overflow-hidden">
        <motion.div className="absolute inset-0 bg-muted" style={{ y: backdropY }}>
          {!isBackdropLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="h-16 w-16 animate-pulse rounded-full bg-muted-foreground/20"></div>
            </div>
          )}

          <motion.img
            src={movie.backdrop || `/placeholder.svg?height=1080&width=1920`}
            alt={movie.title}
            className="h-full w-full object-cover"
            onLoad={() => setIsBackdropLoaded(true)}
            style={{
              display: isBackdropLoaded ? "block" : "none",
            }}
          />

          {/* Gradient overlays for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent"></div>
        </motion.div>

        {/* Back Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4 z-10 rounded-full bg-background/30 backdrop-blur-sm hover:bg-background/50"
          onClick={handleBack}
        >
          <ArrowLeft size={20} />
        </Button>

        {/* Hero Content */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-20 pt-24">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              {/* Title and Year */}
              <h1 className="mb-2 text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
                {movie.title}
              </h1>

              {/* Movie Meta Info */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                {movie.releaseDate && (
                  <Badge
                    variant="outline"
                    className="bg-background/30 backdrop-blur-sm text-white border-white/20"
                  >
                    <Calendar size={14} className="mr-1" />
                    {new Date(movie.releaseDate).getFullYear()}
                  </Badge>
                )}

                {movie.rating && (
                  <Badge
                    variant="outline"
                    className="bg-background/30 backdrop-blur-sm text-white border-white/20"
                  >
                    <Star size={14} className="mr-1 fill-yellow-400 text-yellow-400" />
                    {movie.rating.toFixed(1)}
                  </Badge>
                )}

                {/* Runtime would be added here if available in the API */}
                <Badge
                  variant="outline"
                  className="bg-background/30 backdrop-blur-sm text-white border-white/20"
                >
                  <Clock size={14} className="mr-1" />
                  2h 15m
                </Badge>
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {movie.genres.map((genre, index) => (
                    <Badge
                      key={index}
                      className="bg-primary/80 hover:bg-primary text-primary-foreground"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Synopsis Preview */}
              <div className="mb-6">
                <p
                  className={`text-white/90 text-lg leading-relaxed ${
                    !showFullSynopsis ? "line-clamp-3" : ""
                  }`}
                >
                  {movie.synopsis || "No synopsis available."}
                </p>
                {movie.synopsis && movie.synopsis.length > 150 && (
                  <button
                    onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                    className="mt-2 flex items-center text-sm text-primary hover:underline"
                  >
                    {showFullSynopsis ? "Show less" : "Show more"}
                    <ChevronDown
                      size={16}
                      className={`ml-1 transition-transform ${
                        showFullSynopsis ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {hasTrailer && (
                  <Button
                    size="lg"
                    className="rounded-full shadow-lg"
                    onClick={() => setShowTrailer(true)}
                  >
                    <Play size={18} className="mr-2" fill="currentColor" />
                    Play Trailer
                  </Button>
                )}

                <Button
                  variant={isFavorite ? "default" : "outline"}
                  size="lg"
                  className="rounded-full shadow-lg"
                  onClick={handleFavoriteToggle}
                >
                  {isFavorite ? (
                    <>
                      <Check size={18} className="mr-2" />
                      Added to Favorites
                    </>
                  ) : (
                    <>
                      <Plus size={18} className="mr-2" />
                      Add to Favorites
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Movie Details Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          {/* Main Content */}
          <div>
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="cast">Cast</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 animate-fade-in">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Synopsis</h2>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {movie.synopsis || "No synopsis available."}
                  </p>

                  {/* Trailer Section (if available) */}
                  {hasTrailer && !showTrailer && (
                    <div className="mt-8">
                      <h2 className="text-2xl font-bold mb-4">Trailer</h2>
                      <div
                        className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted cursor-pointer"
                        onClick={() => setShowTrailer(true)}
                      >
                        <img
                          src={movie.backdrop || `/placeholder.svg?height=720&width=1280`}
                          alt={`${movie.title} trailer`}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="rounded-full bg-primary/80 p-6 text-white shadow-lg hover:bg-primary transition-colors">
                            <Play size={32} fill="currentColor" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="cast" className="mt-6 animate-fade-in">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Cast</h2>
                  {movie.cast && movie.cast.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {movie.cast.map((actor, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 rounded-xl border p-3 shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-muted shadow-sm">
                            {actor.profile ? (
                              <img
                                src={actor.profile || "/placeholder.svg"}
                                alt={actor.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                                {actor.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold">{actor.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {actor.character}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No cast information available.
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="details" className="mt-6 animate-fade-in">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Movie Details</h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="rounded-xl border p-4 shadow-sm">
                      <h3 className="mb-2 font-medium">Release Information</h3>
                      <p className="text-lg text-muted-foreground">
                        {movie.releaseDate
                          ? new Date(movie.releaseDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Release date unknown"}
                      </p>
                    </div>

                    <div className="rounded-xl border p-4 shadow-sm">
                      <h3 className="mb-2 font-medium">Rating</h3>
                      <div className="flex items-center gap-2">
                        <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg text-muted-foreground">
                          {movie.rating ? `${movie.rating.toFixed(1)}/10` : "Not rated"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div>
            {/* Movie Trailers List */}
            {movie.trailers && movie.trailers.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-xl font-bold">Trailers & Clips</h3>
                <div className="space-y-3">
                  {movie.trailers.map((trailer, index) => (
                    <div
                      key={index}
                      className="group flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-accent"
                      onClick={() => setShowTrailer(true)}
                    >
                      <div className="relative aspect-video h-16 w-28 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        <img
                          src={movie.backdrop || `/placeholder.svg?height=90&width=160`}
                          alt={trailer.name}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                          <Play size={20} className="text-white" fill="currentColor" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                          {trailer.name}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Movies would go here */}
            <div>
              <h3 className="mb-4 text-xl font-bold">You Might Also Like</h3>
              <div className="rounded-xl border p-4 flex items-center justify-center h-48 bg-muted/50">
                <p className="text-muted-foreground text-center">
                  Similar movies recommendations would appear here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailer && trailerVideoId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl"
            >
              <YouTubeEmbed
                videoId={trailerVideoId}
                title={`${movie.title} - Trailer`}
                onClose={() => setShowTrailer(false)}
                autoplay={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieDetailPage;
