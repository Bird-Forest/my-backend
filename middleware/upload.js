// const multer = require("multer");
// const path = require("path");

// const tempDir = path.join(__dirname, "../", "temp");

// const multerConfig = multer.diskStorage({
//   destination: tempDir,
//   filename: (req, file, cb) => {
//     cb(null, file.originalName);
//   },
// });

// const upload = multer({
//   storage: multerConfig,
// });

// module.exports = upload;
const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, "../temp");
console.log(tempDir);

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, { file }, cb) => {
    console.log("upload", req);
    console.log("upload-file", file);
    cb(null, file);
  },
});

const upload = multer({
  storage: multerConfig,
});

module.exports = upload;
