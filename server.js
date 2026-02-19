const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const app = express();

/* ==============================
   CORS CONFIG (IMPORTANT)
================================= */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://civic-connect.vercel.app" // 🔥 REPLACE WITH YOUR REAL FRONTEND URL
    ],
    credentials: true,
  })
);

app.use(express.json());

/* ==============================
   ROOT CHECK
================================= */
app.get("/", (req, res) => {
  res.send("Civic Connect API is running 🚀");
});

/* ==============================
   API ROUTES
================================= */
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

/* ==============================
   AUTO CREATE ADMIN (VERY IMPORTANT)
================================= */
async function createDefaultAdmin() {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await User.create({
        name: "Admin",
        email: "admin@civicconnect.com",
        password: hashedPassword,
        role: "admin",
      });

      console.log("✅ Default Admin Created");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (error) {
    console.error("Admin creation error:", error);
  }
}

/* ==============================
   DATABASE CONNECTION
================================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");
    await createDefaultAdmin();
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

/* ==============================
   SERVER START (RENDER FIX)
================================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
