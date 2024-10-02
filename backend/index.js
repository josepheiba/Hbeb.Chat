const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
const connect = require("./db");
const cookieParser = require("cookie-parser");

const app = express();

// Connect to MongoDB
connect();

// Morgan error logging
app.use(morgan("dev"));
// Parse JSON
app.use(express.json());
// Cooki parser
app.use(cookieParser());

// Routes
const authRouter = require("./routes/auth");

app.use("/auth", authRouter);

const maxAge = 1000 * 60 * 60 * 24;
// Cookie parser
app.get("/set-cookie", (req, res) => {
  res.cookie("newUser", false, { MaxAge: maxAge, httpOnly: true });
  res.send("Cookie set");
});

app.get("/read-cookie", (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  res.json(cookies);
});

app.use(async (req, res, next) => {
  next(createError.NotFound);
});

app.listen(3000);
