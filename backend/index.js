const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
const connect = require("./db");

const app = express();

// Connect to MongoDB
connect();

// Morgan error logging
app.use(morgan("dev"));
// Parse JSON
app.use(express.json());

// Routes
const authRouter = require("./routes/auth");

app.use("/auth", authRouter);

app.use(async (req, res, next) => {
  next(createError.NotFound);
});

app.listen(3000);
