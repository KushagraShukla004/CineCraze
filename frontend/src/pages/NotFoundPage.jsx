/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Film, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10"
      >
        <Film className="h-12 w-12 text-primary" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-2 text-4xl font-bold"
      >
        404 - Page Not Found
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-8 max-w-md text-muted-foreground"
      >
        The page you're looking for doesn't exist or has been moved. Let's get you back on
        track.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <Button asChild>
          <Link to="/" className="flex items-center gap-2">
            <Home size={16} />
            <span>Back to Home</span>
          </Link>
        </Button>

        <Button variant="outline" asChild>
          <Link to="/movies" className="flex items-center gap-2">
            <span>Explore Movies</span>
            <ArrowRight size={16} />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
