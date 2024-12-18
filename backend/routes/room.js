const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room");
const verifyToken = require("../middleware/verifyToken");

router.post("/create", verifyToken, roomController.create_room_post);
router.post("/fetch", verifyToken, roomController.fetch_room_post);
router.post("/update", verifyToken, roomController.update_room_post);
router.post("/delete", verifyToken, roomController.delete_room_post);

module.exports = router;
