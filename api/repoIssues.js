const express = require("express");
const router = express.Router();
const { fetchIssues } = require("../helpers/github");

router.get("/", async (req, res) => {
  try {
    const { repoUrl } = req.query;
    const issues = await fetchIssues(repoUrl);
    res.json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ error: "Could not fetch issues" });
  }
});

module.exports = router;
