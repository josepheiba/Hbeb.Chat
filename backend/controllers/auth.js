const User = require("../models/user");

module.exports.signin_post = (req, res) => {
  res.send("Sign In");
};

const errorHandling = (error) => {
  const errors = { username: "", email: "", password: "" };
  if (error.message.includes("User validation failed")) {
    const errorKeys = Object.keys(error.errors);
    errorKeys.forEach((key) => {
      errors[key] = error.errors[key].message;
    });
    return errors;
  }
  if (error.message.includes("duplicate key error collection")) {
    console.log(JSON.stringify(error, null, 2));
    if (error.code === 11000) {
      if (error.keyPattern.username) {
        errors.username = "Username is already registered";
      }
      if (error.keyPattern.email) {
        errors.email = "Email is already registered";
      }
      return errors;
    }
  }
};

module.exports.signup_post = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(errorHandling(error));
  }
};
