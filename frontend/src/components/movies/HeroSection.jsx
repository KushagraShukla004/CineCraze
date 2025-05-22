/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = ({ movie }) => {
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [backdropLoaded, setBackdropLoaded] = useState(false);

  if (!movie) return null;

  return (
    <section className="w-full bg-background">
      {/* Mobile Hero Layout */}
      <div className="block md:hidden">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center">
            {/* Movie Poster - Mobile */}
            <div className="mb-4 w-48 overflow-hidden rounded-lg shadow-lg">
              {!posterLoaded && (
                <div className="aspect-[2/3] w-full animate-pulse bg-muted"></div>
              )}
              <img
                src={movie.poster || "/placeholder.svg?height=300&width=200"}
                alt={movie.title}
                className="aspect-[2/3] w-full object-cover"
                onLoad={() => setPosterLoaded(true)}
                style={{ display: posterLoaded ? "block" : "none" }}
              />
            </div>

            {/* Movie Info - Mobile */}
            <div className="text-center">
              <h1 className="mb-2 text-xl font-bold leading-tight sm:text-2xl">
                {movie.title}
              </h1>

              <div className="mb-3 flex items-center justify-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{movie.rating.toFixed(1)}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {movie.releaseYear}
                  </span>
                </div>
              </div>

              <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                {movie.overview || "No synopsis available."}
              </p>

              <Button asChild size="sm" className="rounded-full">
                <Link to={`/movies/${movie.id}`}>
                  <Play className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Hero Layout with Backdrop */}
      <div
        className="relative hidden md:block"
        style={{ height: "min(70vh, 600px)", minHeight: "400px" }}
      >
        {/* Background Image - Only for tablet/desktop */}
        <div className="absolute inset-0 bg-muted">
          {!backdropLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          )}

          <img
            src={movie.backdrop || "/placeholder.svg?height=720&width=1280"}
            alt=""
            className="h-full w-full object-cover opacity-80"
            onLoad={() => setBackdropLoaded(true)}
            style={{ display: backdropLoaded ? "block" : "none" }}
          />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center p-6">
          <div className="container mx-auto">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Movie Poster */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center md:justify-start"
              >
                <div className="aspect-[2/3] w-full max-w-[220px] overflow-hidden rounded-lg shadow-xl">
                  <img
                    src={movie.poster || "/placeholder.svg?height=450&width=300"}
                    alt={movie.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Movie Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col justify-center"
              >
                <h1 className="mb-2 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                  {movie.title}
                </h1>

                <div className="mb-4 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-medium">{movie.rating.toFixed(1)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg text-muted-foreground">
                      {movie.releaseYear}
                    </span>
                  </div>
                </div>

                <p className="mb-6 line-clamp-4 text-lg text-muted-foreground">
                  {movie.overview || "No synopsis available."}
                </p>

                <Button asChild size="lg" className="w-fit rounded-full">
                  <Link to={`/movies/${movie.id}`}>
                    <Play className="mr-2 h-5 w-5" />
                    View Details
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
