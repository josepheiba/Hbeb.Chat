const User = require("../models/user");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;

module.exports.signin_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { MaxAge: maxAge * 1000, httpOnly: true });
    res.status(200).json({ user: user._id });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports.signup_post = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { MaxAge: maxAge * 1000, httpOnly: true });
    res.status(201).json({ user: user._id });
  } catch (error) {
    res.status(400).send(error);
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, "temporary_secret_key", { expiresIn: maxAge });
};
