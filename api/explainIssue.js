const express = require("express");
const router = express.Router();
const { fetchIssueDetails } = require("../helpers/github");
const { generateIssueExplanation } = require("../helpers/generateExplanation");

router.post("/", async (req, res) => {
  try {
    const { repoUrl, issueNumber } = req.body;
    const issueDetails = await fetchIssueDetails(repoUrl, issueNumber);
    const explanation = await generateIssueExplanation(issueDetails);
    res.json({ explanation });
  } catch (error) {
    console.error("Error explaining issue:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
