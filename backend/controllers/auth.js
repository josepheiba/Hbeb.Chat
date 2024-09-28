const User = require("../models/user");

module.exports.signin_post = (req, res) => {
  res.send("Sign In");
};

module.exports.signup_post = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).send(error);
  }
};
