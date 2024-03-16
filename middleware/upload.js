const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, "../temp/");
console.log(tempDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Upload", req);
    console.log("upload", file);
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    console.log("upload-file", file.name);
    cb(null, file.name);
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload;
