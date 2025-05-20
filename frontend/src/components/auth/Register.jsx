/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "@/redux/slices/authSlice";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
//UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Register = ({ switchToLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading, error } = useSelector((state) => state.auth);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Form validation state
  const [validationErrors, setValidationErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.name) {
      errors.name = "Name is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await dispatch(register(formData)).unwrap();
      toast({
        title: "Registration successful",
        description: "Welcome to CineCraze! Your account has been created.",
      });
      navigate("/");
    } catch (err) {
      toast({
        title: "Registration failed",
        description: err || "Failed to create account",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-2xl font-bold mb-6">Create an account</h2>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center text-sm text-destructive">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={`mt-1 w-full ${
              validationErrors.name ? "border-destructive ring-destructive/50" : ""
            }`}
          />
          {validationErrors.name && (
            <p className="text-destructive text-sm mt-1">{validationErrors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="registerEmail" className="text-sm font-medium">
            Email Address
          </Label>
          <Input
            id="registerEmail"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={`mt-1 w-full ${
              validationErrors.email ? "border-destructive ring-destructive/50" : ""
            }`}
          />
          {validationErrors.email && (
            <p className="text-destructive text-sm mt-1">{validationErrors.email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="registerPassword" className="text-sm font-medium">
            Password
          </Label>
          <Input
            id="registerPassword"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={`mt-1 w-full ${
              validationErrors.password ? "border-destructive ring-destructive/50" : ""
            }`}
          />
          {validationErrors.password && (
            <p className="text-destructive text-sm mt-1">{validationErrors.password}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Password must be at least 8 characters
          </p>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Creating account..." : "Sign up"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={switchToLogin}
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
