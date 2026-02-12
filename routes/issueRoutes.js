const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Issue = require("../models/Issue");

const {
  createIssue,
  getIssues,
  getMyIssues,
  updateStatus,
} = require("../controllers/issueController");

/* ======================
   USER ROUTES
====================== */

router.post("/", auth, createIssue);
router.get("/my", auth, getMyIssues);

// ✅ GET SINGLE ISSUE (FIXED)
router.get("/:id", auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // ✅ USE reportedBy (NOT user)
    if (!issue.reportedBy) {
      return res.status(400).json({ message: "Issue owner missing" });
    }

    if (issue.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(issue);
  } catch (err) {
    console.error("LOAD ISSUE ERROR:", err);
    res.status(500).json({ message: "Failed to load issue" });
  }
});

/* ======================
   ADMIN ROUTES
====================== */

router.get("/", auth, admin, getIssues);
router.put("/:id/status", auth, admin, updateStatus);

module.exports = router;
