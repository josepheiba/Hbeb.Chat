const User = require("../models/user");
const Room = require("../models/room");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

module.exports.update_user_post = async (req, res) => {
  const { email, phone, username, biography, contacts } = req.body;
  const { user_id } = res.locals;

  try {
    const updateduser = await User.findByIdAndUpdate(user_id, {
      email,
      phone,
      username,
      biography,
      contacts,
    });
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

module.exports.fetch_contact_post = async (req, res) => {
  const { user_id } = res.locals;
  try {
    const friends = await User.findById(user_id).select("friends");
    console.log(friends);
    const fetchedFriends = await User.find({
      _id: { $in: friends.friends },
    }).select("-password");
    res.status(200).json(fetchedFriends);
  } catch (error) {
    res.status
      .status(400)
      .json({ message: "Error fetching friends", error: error });
  }
};

module.exports.fetch_user_post = async (req, res) => {
  const { users, user, email, phone, room } = req.body;
  const { user_id } = res.locals;
  if (users) {
    try {
      const fetchedUsers = await User.find({ _id: { $in: users } }).select(
        "-password",
      );
      res.status(200).json(fetchedUsers);
    } catch (error) {
      res.status
        .status(400)
        .json({ message: "Error fetching users", error: error });
    }
  } else if (user) {
    try {
      const fetchedUser = await User.findById(user).select("-password");
      console.log(fetchedUser);
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
  } else if (phone) {
    try {
      const fetchedUser = await User.findOne({
        phone,
      }).select("-password");
      res.status(200).json(fetchedUser);
    } catch (error) {
      res.status(400).json(error);
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

module.exports.friend_request_post = async (req, res) => {
  const { user_id } = res.locals;
  const { email } = req.body;
  const { friend_id } = req.body;

  try {
    // Get friend_id either from direct input or email lookup
    let friend_id_email;
    if (email && !friend_id) {
      const friend = await User.findOne({ email });
      if (!friend) {
        return res.status(404).json({ error: "User not found" });
      }
      friend_id_email = friend._id;
    }
    const friendId = friend_id || friend_id_email;

    // Check if already friends
    const requestingUser = await User.findById(user_id);
    if (requestingUser.friends.includes(friendId)) {
      return res.status(400).json({ error: "Already friends with this user" });
    }

    // If not friends, proceed with friend request
    const updatedUser = await User.findByIdAndUpdate(
      friendId,
      {
        $addToSet: { friendRequests: user_id },
      },
      { new: true },
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports.friend_accept_post = async (req, res) => {
  user_id = res.locals.user_id;
  const { friend_id } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(friend_id)) {
      return res.status(400).json({ friend_id: "Invalid friend_id" });
    }
    const friend = await User.findById(friend_id);
    if (!friend) {
      return res.status(404).json({ friend_id: "Friend not found" });
    }
    current_user = await User.findByIdAndUpdate(
      user_id,
      {
        $addToSet: { friends: friend_id },
        $pull: { friendRequests: friend_id },
      },
      { new: true },
    );
    await User.findByIdAndUpdate(
      friend_id,
      {
        $addToSet: { friends: user_id },
      },
      { new: true },
    );
    res.status(200).json(current_user);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports.friend_reject_post = async (req, res) => {
  user_id = res.locals.user_id;
  const { friend_id } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(friend_id)) {
      return res.status(400).json({ friend_id: "Invalid friend_id" });
    }
    const friend = await User.findById(friend_id);
    if (!friend) {
      return res.status(404).json({ friend_id: "Friend not found" });
    }
    current_user = await User.findByIdAndUpdate(
      user_id,
      {
        $pull: { friendRequests: friend_id },
      },
      { new: true },
    );
    res.status(200).json(current_user);
  } catch (error) {
    res.status(400).json(error);
  }
};
