const errorMessageList = {
  400: "Bad request HttpError",
  401: "Not authorized HttpError",
  403: "Forbiden HttpError",
  404: "Not found HttpError",
  409: "Email in use HttpError",
};

const HttpError = (status, message = errorMessageList[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = HttpError;
