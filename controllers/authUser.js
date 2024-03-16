const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const path = require("path");
const gravatar = require("gravatar");

const { User } = require("../models/user");
const { HttpError } = require("../helper");
const { ctrlWrapper } = require("../middleware");
const { nanoid } = require("nanoid");

const { SEKRET_KEY } = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationCode = nanoid();

  const newUser = await User.create({
    ...req.body,
    name,
    password: hashPassword,
    avatarURL,
    verificationCode,
  });

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
      avatarURL,
    },
    token: null,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email is wrong, authUser 1");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Password is wrong, authUser 2");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SEKRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  const avatar = gravatar.url(email);

  res.status(201).json({
    user: { name: user.name, email: user.email, avatarURL: avatar },
    token,
  });
};

const current = async (req, res) => {
  // ** authenticate додає  req.user = user;
  const { email, name, avatarURL } = req.user;
  res.json({
    email,
    name,
    avatarURL,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({
    message: "Logout success",
  });
};

const updateAvatar = async (req, res) => {
  const user = await User.findById(req.user._id);

  const file = req.files.file;
  if (!file) {
    return res.json({ error: "incorrect input name" });
  }

  const filename = encodeURI(`${user._id}_${file.name}`);
  const avatarURL = path.join(avatarDir, filename);

  file.mv(`${avatarURL}`, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    // console.log("File is uploaded");

    User.findByIdAndUpdate(user._id, { avatarURL });

    res.json({ avatarURL });
    // res.json({
    //   fileName: filename,
    //   filePath: `/avatars/${filename}}`,
    // });
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
