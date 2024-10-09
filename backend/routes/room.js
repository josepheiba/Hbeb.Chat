const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room");
const verifyToken = require("../middleware/verifyToken");

router.post("/create", verifyToken, roomController.create_room_post);

module.exports = router;
