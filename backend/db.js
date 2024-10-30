const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/testdb8");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB");
  }
};

module.exports = connect;
