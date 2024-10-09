const mongoose = require("mongoose");
const roomCreateErrorHandling = require("../utils/roomCreateErrorHandling");

const roomSchema = new mongoose.Schema({
  name: String,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// roomSchema.index({ users: 1 }, { unique: true });

roomSchema.pre("save", function (next) {
  next();
});

roomSchema.post("save", function (error, doc, next) {
  roomCreateErrorHandling(error, next);
  next();
});

module.exports = mongoose.model("Room", roomSchema);
