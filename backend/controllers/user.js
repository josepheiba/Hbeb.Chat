const User = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports.update_user_post = async (req, res) => {
  const { email, username, biography } = req.body;
  const { user_id } = res.locals;
  const updatedUser = await User.findByIdAndUpdate(user_id, {
    email,
    username,
    biography,
  });
  res.status(200).json(updatedUser);
};

module.exports.delete_user_post = async (req, res) => {
  const { user_id } = res.locals;
  const deletedUser = await User.findByIdAndDelete(user_id);
  res.status(200).json(deletedUser);
};
