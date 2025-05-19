const multer = require("multer");

const storage = multer.memoryStorage(); // keep file in memory for buffer upload
const upload = multer({ storage });

module.exports = upload;