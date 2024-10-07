const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const verifyToken = require("../middleware/verifyToken");

router.post("/update", verifyToken, userController.update_user_post);
router.post("/delete", verifyToken, userController.delete_user_post);

module.exports = router;
