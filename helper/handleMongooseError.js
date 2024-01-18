const handleMongooseError = (error, data, next) => {
  const { name, code } = error;

  const status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  error.status = status;
  next();
};

module.exports = handleMongooseError;

// const mongoosError = (error, data, next) => {
//   error.status = 400;
//   console.log(error.message);
//   next();
// };
