const roomFetchErrorHandling = (error, next) => {
  const errors = { room_ids: "", users: "" };
  if (error.name && error.name === "CastError") {
    errors.users = error.message;
    next(errors);
  } else if (error) {
    console.log(JSON.stringify(error, null, 2));
    errors.users = "Unexpected error in roomFetchErrorHandling";
    next(errors);
  }
};

module.exports = roomFetchErrorHandling;
