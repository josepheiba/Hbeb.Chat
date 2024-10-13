const User = require("../models/user");
const Room = require("../models/room");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {
  uniqueNamesGenerator,
  adjectives,
  colors,
} = require("unique-names-generator");

module.exports.create_room_post = async (req, res) => {
  const { users } = req.body;
  const { user_id } = res.locals;

  try {
    await validateUsersExist(users, user_id);
    const generatedName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors],
    });

    const uniqueUsers = [...new Set(users)];

    if (uniqueUsers.length < 3) {
      const fetchRoom = await Room.findOne({
        users: {
          $all: uniqueUsers,
          $size: uniqueUsers.length,
        },
      });
      if (fetchRoom) {
        return res.status(200).json({
          room_id: fetchRoom._id,
          users: fetchRoom.users,
          owner: room.owner,
        });
      }
    }

    let room;
    if (uniqueUsers.length > 2) {
      room = await Room.create({
        name: generatedName,
        users: uniqueUsers,
        owner: user_id,
      });
    } else {
      room = await Room.create({
        name: generatedName,
        users: uniqueUsers,
      });
    }

    await User.updateMany(
      { _id: { $in: uniqueUsers } },
      { $push: { rooms: room._id } },
    );

    if (uniqueUsers.length > 2) {
      res.status(201).json({
        room_id: room._id,
        users: room.users,
        owner: room.owner,
      });
    } else {
      res.status(201).json({
        room_id: room._id,
        users: room.users,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

module.exports.fetch_room_post = async (req, res) => {
  const errors = { room_ids: "" };
  const { user_id } = res.locals;
  try {
    if (req.body.room_ids && req.body.room_ids.length > 0) {
      const { room_ids } = req.body;
      // Validate and filter room_ids
      const validRoom_ids = room_ids.filter((id) =>
        mongoose.Types.ObjectId.isValid(id),
      );
      if (validRoom_ids.length !== room_ids.length) {
        throw { room_ids: "Invalid room id(s)" };
      }
      const rooms = await Room.find({
        _id: { $in: validRoom_ids },
        users: user_id,
      });
      if (rooms.length > 0) {
        return res.status(200).json(rooms);
      }
    }
    if (req.body.users) {
      const { users } = req.body;
      await validateUsersExist(users, user_id);
      const rooms = await Room.find({
        users: {
          $all: users,
          $size: users.length,
        },
      });
      if (rooms.length > 0) {
        return res.status(200).json(rooms);
      }
    }
    if (!req.body.room_ids && !req.body.users && res.locals.user_id) {
      const rooms = await Room.find({ users: user_id });
      return res.status(200).json(rooms);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

// validate if user_id is included in users array
const validateUsersExist = async (users, user_id) => {
  const errors = { users: "" };
  if (!users.includes(user_id)) {
    errors.users = "Signed in user not included in room";
    throw errors;
  }
  const validUsers = users.filter((id) => mongoose.Types.ObjectId.isValid(id));
  const existingUsers = await User.find({ _id: { $in: validUsers } });
  if (existingUsers.length !== users.length) {
    errors.users = "Invalid user in users array";
    throw errors;
  }
  return null;
};
