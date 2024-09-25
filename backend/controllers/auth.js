const User = require("../models/user");

module.exports.signin_post = (req, res) => {
  res.send("Sign In");
};

module.exports.signup_post = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Password must be at least 6 characters long");
    }
    if (emailExists || usernameExists) {
      return res.status(400).send("User already exists");
    } else {
      try {
        const user = new User({ username, email, password });
        user.save();
        res.send({ email: user.email, username: user.username });
      } catch (error) {
        res.status(400).send;
      }
    }
  } catch (error) {
    res.status(500).send("Error");
  }
};
