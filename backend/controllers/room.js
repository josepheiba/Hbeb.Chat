const User = require("../models/user");
const Room = require("../models/room");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require("unique-names-generator");

module.exports.create_room_post = async (req, res) => {
  const { users } = req.body;
  const { user_id } = res.locals;

  try {
    await validateUsersExist(users, user_id);
    const generatedName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });

    const uniqueUsers = [...new Set([user_id, ...users])].sort();

    const room = await Room.create({
      name: generatedName,
      users: uniqueUsers,
    });

    await User.updateMany(
      { _id: { $in: uniqueUsers } },
      { $push: { rooms: room._id } },
    );

    // const roomWithUsers = await Room.findById(room._id).populate("users");
    // console.log(roomWithUsers);

    res.status(201).json({
      room_id: room._id,
      users: room.users,
    });
  } catch (error) {
    // console.log(error);
    res.status(400).send(error);
  }
};

// validate if user_id is included in users array
const validateUsersExist = async (users, user_id) => {
  const errors = { users: "" };
  if (!users.includes(user_id)) {
    errors.users = "Signed in user not included in room";
    throw errors;
  }
  return null;
};
