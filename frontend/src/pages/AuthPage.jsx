/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Film } from "lucide-react";
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("login");
  console.log("activeTab: ", activeTab);

  // If user is already logged in, redirect to home or the page they were trying to access
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Check if the URL has a specific tab parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "register") {
      setActiveTab("register");
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-background to-muted">
      {/* Left Panel - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden md:flex flex-col justify-center items-start w-full md:w-1/2 h-screen px-12 text-foreground"
      >
        <div className="space-y-6 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Your Ultimate Movie Experience
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Discover, explore, and keep track of your favorite movies with CineCraze.
          </motion.p>

          {/* Feature list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-8 space-y-4"
          >
            {[
              "Browse thousands of movies",
              "Create your personalized watchlist",
              "Save your favorite movies",
              "Get recommendations based on your taste",
            ].map((feature, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <svg
                    className="h-3 w-3 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel - Auth Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex justify-center items-center w-full md:w-1/2 min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary">
                <Film className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              CineCraze
            </h2>
            <p className="mt-2 text-muted-foreground">Your ultimate movie companion</p>
          </div>

          <div className="bg-card shadow-lg rounded-xl p-8 border border-muted">
            <Tabs
              defaultValue="login"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: activeTab === "login" ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: activeTab === "login" ? 20 : -20 }}
                    transition={{ duration: 0.3 }}
                  >
                <Login switchToRegister={() => setActiveTab("register")} />
                  </motion.div>
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: activeTab === "register" ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: activeTab === "register" ? 20 : -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Register switchToLogin={() => setActiveTab("login")} />
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            </Tabs>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            By continuing, you agree to CineCraze's Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
