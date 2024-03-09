const { isValidObjectId } = require("mongoose");

const { HttpError } = require("../helper");

const isValidId = (req, data, next) => {
  const { taskId } = req.params;
  if (!isValidObjectId(taskId)) {
    next(HttpError(400, `${taskId} is not valid id, isValidId`));
  }
  next();
};

module.exports = isValidId;
