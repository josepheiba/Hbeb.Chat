const mongoose = require("mongoose");
const roomCreateErrorHandling = require("../utils/roomCreateErrorHandling");
const roomFetchErrorHandling = require("../utils/roomFetchErrorHandling");

const roomSchema = new mongoose.Schema({
  name: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  // messages: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Message",
  //   },
  // ],
  lastActivity: {
    type: Date,
    default: Date.now,
  },
});

// roomSchema.index({ users: 1 }, { unique: true });

roomSchema.post("save", function (error, doc, next) {
  if (error) {
    roomCreateErrorHandling(error, next);
  }
  next();
});

roomSchema.post("find", function (error, doc, next) {
  if (error) {
    roomFetchErrorHandling(error, next);
  }
  next();
});

module.exports = mongoose.model("Room", roomSchema);
