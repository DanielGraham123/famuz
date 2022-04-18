const multer = require("multer");
// const path = require("path");

const extensions = ["jpg", "png", "jpeg", "webp"];

// Multer configuration
const uploadUtil = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, callback) => {
    let ext = file.mimetype.split("/")[1];

    console.log();
    console.log("file extension", ext);

    if (!extensions.includes(ext)) {
      callback(new Error("File type is not supported"), false);
      return;
    }

    callback(null, true);
  },
});

module.exports = uploadUtil;
