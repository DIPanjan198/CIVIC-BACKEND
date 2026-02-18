const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = new User({
    name: "Admin",
    email: "admin@civicconnect.com",
    password: hashedPassword,
    role: "admin",
  });

  await admin.save();
  console.log("Admin created!");
  process.exit();
}

createAdmin();
