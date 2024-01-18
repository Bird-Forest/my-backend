const jwt = require("jsonwebtoken");

const { HttpError } = require("../helper");
const { User } = require("../models/user");

const { SEKRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized, authenticate 1"));
  }
  try {
    const { id } = jwt.verify(token, SEKRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "Not authorized, authenticate 2"));
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401));
  }
};

module.exports = authenticate;
