const { isValidObjectId } = require("mongoose");

const { HttpError } = require("../helper");

const isValidId = (req, data, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    next(HttpError(400, `${contactId} is not valid id, isValidId`));
  }
  next();
};

module.exports = isValidId;
