const dotenv = require("dotenv");
const server = require("./app");
const connectDB = require("./config/db");
const createDefaultAdmins = require("./services/createDefaultAdmins");

dotenv.config();

const PORT = process.env.PORT || 7002;

connectDB();
createDefaultAdmins();

server.listen(PORT, () => {
  console.log(`cakeconnect backend server running on ${PORT}`);
});
