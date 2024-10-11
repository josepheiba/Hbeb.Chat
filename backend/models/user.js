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
  console.log(user);
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error((errors.password = "Incorrect password"));
  }
  throw Error((errors.email = "Incorrect email"));
};

module.exports = mongoose.model("User", userSchema);
