const User = require("../models/user");
const Room = require("../models/room");
const Message = require("../models/message");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

module.exports.update_room_post = async (req, res) => {
  const { room_id, name, users } = req.body;
  const { user_id } = res.locals;

  try {
    // Check if the room exists and the user is a member
    let room = await Room.findOne({ _id: room_id, users: user_id });

    if (!room) {
      return res
        .status(404)
        .json({ error: "Room not found or you're not a member" });
    }

    // Update the room name if provided
    if (name) {
      room.name = name;
    }

    // Update the users list if provided
    if (users && Array.isArray(users)) {
      // Ensure the current user remains in the room
      if (!users.includes(user_id)) {
        users.push(user_id);
      }

      // Validate that all user IDs are valid ObjectIds
      const validUserIds = users.filter((id) =>
        mongoose.Types.ObjectId.isValid(id),
      );
      if (validUserIds.length !== users.length) {
        return res.status(400).json({ error: "Invalid user ID(s) provided" });
      }

      // Update the users array
      room.users = validUserIds;
    }

    // Save the updated room
    await room.save();

    // Fetch the updated room
    room = await Room.findById(room._id);

    // Prepare the response
    const response = {
      room_id: room._id,
      users: room.users,
    };

    // Add name to response if it exists
    if (room.name) {
      response.name = room.name;
    }

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to update room" });
  }
};

module.exports.delete_room_post = async (req, res) => {
  const { room_id } = req.body;
  const { user_id } = res.locals;

  try {
    // Check if the room exists and the user is a member
    const room = await Room.findOne({ _id: room_id, users: user_id });

    if (!room) {
      return res
        .status(404)
        .json({ error: "Room not found or you're not a member" });
    }

    // Remove the room from users' room lists
    await User.updateMany(
      { _id: { $in: room.users } },
      { $pull: { rooms: room._id } },
    );

    // Delete the room
    await Room.deleteOne({ _id: room_id });

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to delete room" });
  }
};

module.exports.create_room_post = async (req, res) => {
  const { users, name } = req.body;
  const { user_id } = res.locals;

  try {
    await validateUsersExist(users, user_id);
    const generatedName = name || "Untitled";

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
          // owner: room.owner,
        });
      }
    }

    let room;
    if (uniqueUsers.length > 2) {
      room = await Room.create({
        name: generatedName,
        users: uniqueUsers,
        // owner: user_id,
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
        // owner: room.owner,
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
  let rooms;

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
      rooms = await Room.find({
        _id: { $in: validRoom_ids },
        users: user_id,
      });

      console.log("ok");
      console.log(rooms);

      // Send empty array if no rooms found
      if (rooms.length === 0) {
        return res.status(200).json([]);
      }

      // Get last messages for each room
      const roomsWithLastMessages = await Promise.all(
        rooms.map(async (room) => {
          const lastMessage = await Message.findOne({ room: room._id })
            .sort({ timestamp: -1 })
            .select("content sender timestamp")
            .populate("sender", "email")
            .lean();

          const roomObject = room.toObject();
          return {
            ...roomObject,
            lastMessage: lastMessage || null,
          };
        }),
      );

      console.log("Rooms with last messages:", roomsWithLastMessages);
      return res.status(200).json(roomsWithLastMessages);
    }

    if (req.body.users) {
      const { users } = req.body;
      await validateUsersExist(users, user_id);
      rooms = await Room.find({
        users: {
          $all: users,
          // $size: users.length,
        },
      });

      // Send empty array if no rooms found
      if (rooms.length === 0) {
        return res.status(200).json([]);
      }

      // Get last messages for each room
      const roomsWithLastMessages = await Promise.all(
        rooms.map(async (room) => {
          const lastMessage = await Message.findOne({ room: room._id })
            .sort({ timestamp: -1 })
            .select("content sender timestamp")
            .populate("sender", "email")
            .lean();

          const roomObject = room.toObject();
          return {
            ...roomObject,
            lastMessage: lastMessage || null,
          };
        }),
      );

      console.log("Rooms with last messages:", roomsWithLastMessages);
      return res.status(200).json(roomsWithLastMessages);
    }

    if (!req.body.room_ids && !req.body.users && res.locals.user_id) {
      rooms = await Room.find({ users: user_id });

      // Send empty array if no rooms found
      if (rooms.length === 0) {
        return res.status(200).json([]);
      }

      // Get last messages for each room
      const roomsWithLastMessages = await Promise.all(
        rooms.map(async (room) => {
          const lastMessage = await Message.findOne({ room: room._id })
            .sort({ timestamp: -1 })
            .select("content sender timestamp")
            .populate("sender", "email")
            .lean();

          const roomObject = room.toObject();
          return {
            ...roomObject,
            lastMessage: lastMessage || null,
          };
        }),
      );

      console.log("Rooms with last messages:", roomsWithLastMessages);
      return res.status(200).json(roomsWithLastMessages);
    }

    // If no rooms found at this point, send empty array
    return res.status(200).json([]);
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
