const mongoose = require("mongoose");
var validator = require("validator");
const bycrypt = require("bcrypt");
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

userSchema.post("save", function (error, doc, next) {
  signUpErrorHandling(error, next);
  next();
});

userSchema.pre("save", async function (next) {
  this.password = await hashPassword(this.password);
  next();
});

userSchema.statics.login = async function (email, password) {
  const errors = { email: "", password: "" };
  const user = await this.findOne({ email });
  if (user) {
    if (bycrypt.compare(password, user.password)) {
      return user;
    }
    throw Error((errors.password = "Incorrect password"));
  }
  throw Error((errors.email = "Incorrect email"));
};

module.exports = mongoose.model("User", userSchema);
