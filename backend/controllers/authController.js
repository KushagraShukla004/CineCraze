const User = require("../models/User.js");
const {createToken} = require("../config/jwt.js");

//1. Register User
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the details.",
      });
    }

    const user = await User.create({ name, email, password });
    const token = createToken(user);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)[0].message,
      });
    }
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// 2. Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    //select("+password"): add password field to the response too because by default it is chosen to never "select" in the response.
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    //correctPassword(enteredPassword, userDbpassword)
    const isMatch = await user.correctPassword(password, user.password);
    if (!isMatch) {
      return res.status(402).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = createToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// 3. Get current user profile
const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};

module.exports = { register, login, currentUser };
