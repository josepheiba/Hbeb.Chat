const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const verifyToken = (req, res, next) => {
  // const token = req.headers["authorization"];
  const errors = { token: "", user_id: "" };
  const token = req.body.token;
  const user_id = req.body.user_id;
  if (token && user_id) {
    jwt.verify(token, "temporary_secret_key", (err, decoded) => {
      if (err) {
        errors.token = "Invalid token";
        return res.status(401).send(errors);
      }
      if (decoded.id !== user_id) {
        errors.user_id = "user_id does not match token";
        return res.status(401).send(errors);
      }
      res.locals.user_id = decoded.id;
      next();
    });
  } else {
    errors.token = "Token required";
    errors.user_id = "user_id required";
    return res.status(401).send(errors);
  }
};

module.exports = verifyToken;
