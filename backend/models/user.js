const mongoose = require("mongoose");
var validator = require("validator");
const signUpErrorHandling = require("../utils/authErrorHandling");
const hashPassword = require("../utils/hashPassword");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: [validator.isEmail, "Email must be valid"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
});

userSchema.post("save", (error, doc, next) => {
  signUpErrorHandling(error, next);
  next();
});

userSchema.pre("save", async (next) => {
  this.password = await hashPassword(this.password);
  next();
});

module.exports = mongoose.model("User", userSchema);
