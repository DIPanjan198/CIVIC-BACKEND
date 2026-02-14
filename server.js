const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("Civic Connect API is running 🚀");
});

/* =========================
   API ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

/* =========================
   DATABASE
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
