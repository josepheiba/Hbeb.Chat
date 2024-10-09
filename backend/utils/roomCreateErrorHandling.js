const roomCreateErrorHandling = (error, next) => {
  const errors = { users: "" };
  if (
    error.name &&
    error.name === "ValidationError" &&
    error.errors["users.1"]
  ) {
    errors.users = error.errors["users.1"].message;
    next(errors);
  } else if (error) {
    console.log(JSON.stringify(error, null, 2));
    errors.users = "Unexpected error in roomCreateErrorHandling";
    next(errors);
  }
};

module.exports = roomCreateErrorHandling;
