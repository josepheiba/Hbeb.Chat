const signUpErrorHandling = (error, next) => {
  const errors = { username: "", email: "", password: "" };
  if (error.name && error.name === "ValidationError") {
    const errorKeys = Object.keys(error.errors);
    errorKeys.forEach((key) => {
      errors[key] = error.errors[key].message;
    });
    next(errors);
  }
  if (error.code && error.code === 11000) {
    if (error.keyPattern.username) {
      errors.username = "Username is already registered";
    }
    if (error.keyPattern.email) {
      errors.email = "Email is already registered";
    }
    next(errors);
  }
};

module.exports = signUpErrorHandling;
