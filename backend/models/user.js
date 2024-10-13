const mongoose = require("mongoose");
var validator = require("validator");
const signUpErrorHandling = require("../utils/authErrorHandling");
const hashPassword = require("../utils/hashPassword");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  biography: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: [validator.isEmail, "Email must be valid"],
  },
  phone: {
    type: String,
    validate: [validator.isMobilePhone, "Phone number must be valid"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

userSchema.post("save", function (error, doc, next) {
  console.log(error);
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
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    errors.password = "Incorrect password";
  } else {
    errors.email = "Incorrect email";
  }
  throw errors;
};

module.exports = mongoose.model("User", userSchema);
