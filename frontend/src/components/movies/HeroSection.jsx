/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Star } from "lucide-react";
import { Button } from "../ui/button";

const HeroSection = ({ movie }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!movie) return null;

  return (
    <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-muted">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        )}

        <img
          src={movie.backdrop || "/placeholder.svg"}
          alt={movie.title}
          className="h-full w-full object-cover opacity-80"
          onLoad={() => setImageLoaded(true)}
          style={{
            display: imageLoaded ? "block" : "none",
          }}
        />

        {/* Gradient Overlay */}
        <div className="hero-gradient"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="container mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          {/* Movie Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full max-w-xs"
          >
            <div className="overflow-hidden rounded-lg shadow-2xl">
              <img
                src={movie.poster || "/placeholder.svg"}
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
            <h1 className="mb-2 text-3xl font-heading font-bold md:text-4xl lg:text-5xl">
              {movie.title}
            </h1>

            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{movie.rating.toFixed(1)}</span>
              </div>

              <span className="text-muted-foreground font-medium">
                {movie.releaseYear}
              </span>
            </div>

            <p className="mb-6 line-clamp-3 text-muted-foreground md:line-clamp-4 text-lg">
              {movie.overview || "No synopsis available."}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full shadow-lg">
                <Link to={`/movies/${movie.id}`}>
                  <Play className="mr-2 h-5 w-5" />
                  View Details
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
