const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: [String, "Username must be a string"],
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

module.exports = mongoose.model("User", userSchema);
