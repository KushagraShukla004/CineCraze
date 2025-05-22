/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const MovieCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="movie-card h-full"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
        <div className="absolute inset-0 animate-pulse bg-muted"></div>

        {/* Skeleton for Movie Card*/}
        <div className="absolute bottom-0 w-full p-3 sm:p-4">
          <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-muted-foreground/20 sm:h-5"></div>
          <div className="flex items-center justify-between">
            <div className="h-3 w-1/4 animate-pulse rounded bg-muted-foreground/20 sm:h-4"></div>
            <div className="h-5 w-5 animate-pulse rounded-full bg-muted-foreground/20 sm:h-6 sm:w-6"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCardSkeleton;
