const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // const token = req.headers["authorization"];
  const token = req.body.token;
  const user_id = req.body.user_id;
  if (token && user_id) {
    jwt.verify(token, "temporary_secret_key", (err, decoded) => {
      if (err) {
        res.status(401).send("Unauthorized: invalid token");
      }
      if (decoded.id !== user_id) {
        res.status(401).send("Unauthorized: invalid user_id");
      } else {
        res.locals.user_id = decoded.id;
        next();
      }
    });
  } else {
    res.status(401).send("Unauthorized");
  }
};

module.exports = verifyToken;
