const User = require("../models/user");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;

module.exports.token_post = async (req, res) => {
  res.status(200).json({ token: "Token is valid", userId: res.locals.user_id });
};

module.exports.signin_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    // res.cookie("jwt", token, { MaxAge: maxAge * 1000, httpOnly: true });
    res.status(200).json({
      user_id: user._id,
      token: token,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports.signup_post = async (req, res) => {
  const { email, phone, password, username, biography } = req.body;
  try {
    const user = await User.create({
      username: "" || username,
      biography: "" || biography,
      email,
      phone,
      password,
    });
    console.log(user);
    const token = createToken(user._id);
    // res.cookie("jwt", token, { MaxAge: maxAge * 1000, httpOnly: true });
    res.status(201).json({
      user_id: user._id,
      token: token,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, "temporary_secret_key", { expiresIn: maxAge });
};
