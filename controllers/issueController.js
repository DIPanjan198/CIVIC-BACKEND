const Issue = require("../models/Issue");

/* ======================
   CREATE ISSUE
====================== */
exports.createIssue = async (req, res) => {
  try {
    console.log("USER IN CREATE ISSUE:", req.user);

    const issue = await Issue.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,

      // ✅ OWNER FIELDS (CORRECT)
      reportedBy: req.user._id,
      reportedByName: req.user.name,
      reportedByEmail: req.user.email,

      status: "pending",
    });

    res.status(201).json(issue);
  } catch (err) {
    console.error("CREATE ISSUE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   GET LOGGED-IN USER ISSUES
====================== */
exports.getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({
      reportedBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(issues);
  } catch (err) {
    console.error("GET MY ISSUES ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   ADMIN: GET ALL ISSUES
====================== */
exports.getIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    console.error("GET ALL ISSUES ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   ADMIN: UPDATE STATUS
====================== */
exports.updateStatus = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
