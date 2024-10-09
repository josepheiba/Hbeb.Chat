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

    if (users.length < 3) {
      const fetchRoom = await Room.findOne({
        users: {
          $all: users,
          $size: users.length,
        },
      });
      if (fetchRoom) {
        return res.status(201).json({
          room_id: fetchRoom._id,
          users: fetchRoom.users,
        });
      }
    }

    const room = await Room.create({
      name: generatedName,
      users: users,
    });

    await User.updateMany(
      { _id: { $in: users } },
      { $push: { rooms: room._id } },
    );

    res.status(200).json({
      room_id: room._id,
      users: room.users,
    });
  } catch (error) {
    // console.log(error);
    res.status(400).send(error);
  }
};

module.exports.fetch_room_post = async (req, res) => {
  const { user_id } = res.locals;
  if (req.body.room_ids) {
    const { room_ids } = req.body;
    const rooms = await Room.find({
      _id: { $in: room_ids },
      users: user_id,
    });
    res.status(200).json(rooms);
  } else if (req.body.users) {
    const { users } = req.body;
    await validateUsersExist(users, user_id);
    const rooms = await Room.find({
      users: {
        $all: users,
        $size: users.length,
      },
    });
    res.status(200).json(rooms);
  } else {
    const rooms = await Room.find({ users: user_id });
    res.status(200).json(rooms);
  }
};

// validate if user_id is included in users array
const validateUsersExist = async (users, user_id) => {
  const errors = { users: "" };
  if (!users.includes(user_id)) {
    errors.users = "Signed in user not included in room";
    throw errors;
  }
  const existingUsers = await User.find({ _id: { $in: users } });
  if (existingUsers.length !== users.length) {
    errors.users = "Invalid user in users array";
    throw errors;
  }
  return null;
};
