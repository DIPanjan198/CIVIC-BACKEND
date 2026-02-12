const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: String,

    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved"],
      default: "pending",
    },

    // ✅ OWNER
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reportedByName: String,
    reportedByEmail: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
