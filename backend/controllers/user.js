const User = require("../models/user");
const Room = require("../models/room");
const jwt = require("jsonwebtoken");

module.exports.update_user_post = async (req, res) => {
  const { email, username, biography, contacts } = req.body;
  const { user_id } = res.locals;

  const updateFields = {};
  if (email) updateFields.email = email;
  if (username) updateFields.username = username;
  if (biography) updateFields.biography = biography;
  if (contacts) updateFields.contacts = contacts;

  try {
    const updateduser = await User.findByIdAndUpdate(user_id, updateFields);
    if (updateduser) {
      console.log(user_id);
      res.status(200).json(updateduser);
    } else {
      res.status(404).json({ user_id: "User not found" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports.fetch_user_post = async (req, res) => {
  const { user, email, room } = req.body;
  const { user_id } = res.locals;
  if (user) {
    try {
      const fetchedUser = await User.findById(user).select("-password");
      res.status(200).json(fetchedUser);
    } catch (error) {
      res.status(400).send(error);
    }
  } else if (email) {
    try {
      const fetchedUser = await User.findOne({ email }).select("-password");
      res.status(200).json(fetchedUser);
    } catch (error) {
      res.status(400).send(error);
    }
  } else if (room) {
    try {
      const fetchedRoom = await Room.findById(room);
      if (!fetchedRoom) {
        return res.status(404).json({ message: "Room not found" });
      }
      const fetchedUsers = await User.find({
        _id: { $in: fetchedRoom.users },
      }).select("-password");
      res.status(200).json(fetchedUsers);
    } catch (error) {
      res.status(400).json(error);
    }
  } else
    try {
      const fetchedUser = await User.findById(user_id).select("-password");
      res.status(200).json(fetchedUser);
    } catch (error) {
      res.status(400).json(error);
    }
};

module.exports.delete_user_post = async (req, res) => {
  const { user_id } = res.locals;
  const deletedUser = await User.findByIdAndDelete(user_id);
  res.status(200).json(deletedUser);
};
