const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const verifyToken = require("../middleware/verifyToken");

router.post("/signin", authController.signin_post);
router.post("/signup", authController.signup_post);

router.post("/token", verifyToken, authController.token_post);

router.delete("/signout", async (req, res, next) => {
  res.send("Sign Out");
});

module.exports = router;
