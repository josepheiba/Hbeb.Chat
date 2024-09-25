const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.post("/signin", authController.signin_post);
router.post("/signup", authController.signup_post);

router.post("/token", async (req, res, next) => {
  res.send("Token");
});

router.delete("/signout", async (req, res, next) => {
  res.send("Sign Out");
});

module.exports = router;
