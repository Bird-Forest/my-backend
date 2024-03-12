const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const path = require("path");
const fs = require("fs/promises");
const gravatar = require("gravatar");
// const Jimp = require("jimp");

const { User } = require("../models/user");
const { HttpError } = require("../helper");
const { ctrlWrapper } = require("../middleware");
const { nanoid } = require("nanoid");

const { SEKRET_KEY } = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { name, email, password } = req.body;

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
  const { _id } = req.user;
  console.log("udateAvatar", req.user);

  const { path: tempUpload, file } = req.file;
  console.log("file", req.file);

  const resultUpload = path.join(avatarDir, file);

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", file);
  console.log("Avatar", avatarURL);

  // if (!req.file) {
  //   return res.status(400).json({ message: "No file uploaded" });
  // }

  // const avatarURL = req.file.path;
  await User.findByIdAndUpdate(_id, { avatarURL });

  // user.avatarURL = avatarURL;
  // user.save();

  res.json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  // verifyEmail: ctrlWrapper(verifyEmail),
  // resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  // updateStatusUser: ctrlWrapper(updateStatusUser),
  updateAvatar: ctrlWrapper(updateAvatar),
};

// const updateStatusUser = async (req, res) => {
//   const { _id } = req.params;
//   const subscription = await User.findByIdAndUpdate(_id, req.body, {
//     new: true,
//   });

//   res.json(subscription);
// };

// const updateAvatar = async (req, res) => {
//   if (!req.file) {
//     throw HttpError(404, "Not found");
//   }
//   const { _id } = req.user;

//   const { path: tempUpload, originalname } = req.file;

//   await Jimp.read(tempUpload).then((avatar) => {
//     return avatar
//       .resize(250, 250) // resize
//       .quality(60) // set JPEG quality
//       .write(tempUpload); // save
//   });

//   const filename = `${_id}_${originalname}`;
//   const avatarsUpload = path.join(avatarDir, filename);
//   await fs.rename(tempUpload, avatarsUpload);
//   const avatarURL = path.join("avatar", filename);

//   await User.findByIdAndUpdate(_id, { avatarURL });

//   res.json({
//     avatarURL,
//   });
// };
