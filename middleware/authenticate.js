const jwt = require("jsonwebtoken");
const { HttpError } = require("../helper");
const { User } = require("../models/user");
const { SEKRET_KEY } = process.env;

// ** Перевірка валідності токена та користувача, назва функції !!з маленької літери**
const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  // console.log("heders", req.headers);
  // ** перевірка токена ***
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized, authenticate 1"));
  }
  try {
    // ** визначаємо користувача по id **
    const { id } = jwt.verify(token, SEKRET_KEY);
    //   ** шукаємо користувача **
    const user = await User.findById(id);
    // console.log("Authenticate token", user);
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "Not authorized, authenticate 2"));
    }
    // ** Додаємо в тіло запиту об'єкт користувача і надалі використовуємо в контроллерах tasks **
    // !!! обов'язково
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401));
  }
};

module.exports = authenticate;
// (!user || !user.token || user.token !== token)
