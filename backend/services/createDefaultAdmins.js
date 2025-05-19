const Admin = require("../models/adminModel");

const createDefaultAdmins = async () => {
  const existingAdmins = await Admin.find();
  if (existingAdmins.length > 0) {
    console.log("Default admins already exist");
    return;
  }

  const defaultAdmins = [
    {
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    },
  ];

  for (let adminData of defaultAdmins) {
    if (!adminData.email || !adminData.password) {
      console.warn(
        "Skipping admin with missing email or password:",
        adminData.name
      );
      continue;
    }

    const exists = await Admin.findOne({ email: adminData.email });
    if (!exists) {
      await Admin.create({ ...adminData, role: "admin" });
      console.log(`Created admin: ${adminData.email}`);
    }
  }
};

module.exports = createDefaultAdmins;
