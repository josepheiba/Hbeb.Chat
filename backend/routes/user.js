const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const verifyToken = require("../middleware/verifyToken");

router.post("/update", verifyToken, userController.update_user_post);
router.post("/delete", verifyToken, userController.delete_user_post);
router.post("/fetch", verifyToken, userController.fetch_user_post);
router.post("/friend_request", verifyToken, userController.friend_request_post);
router.post("/friend_accept", verifyToken, userController.friend_accept_post);

module.exports = router;
