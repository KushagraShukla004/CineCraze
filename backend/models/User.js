const { Schema, model } = require("mongoose");
const { hash, compare } =  require("bcryptjs");
const validator = require("validator");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      //to not be selected by default whenever user model is called
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password, 12);
  next();
});

// Password comparison method
userSchema.methods.correctPassword = async function (candidatePassword) {
  return await compare(candidatePassword, this.password);
};

module.exports = model("User", userSchema);
