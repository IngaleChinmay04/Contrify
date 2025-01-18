const express = require("express");
const router = express.Router();
const { fetchReadmeContent } = require("../helpers/github");
const { generateSummary } = require("../helpers/generateSummary");

router.get("/", async (req, res) => {
  try {
    const githubRepoUrl = req.query.url;
    const repoResponse = await axios.get(githubRepoUrl, {
      headers: { Authorization: `token ${process.env.REACT_APP_GIT_API_KEY}` },
    });
    const repoInfo = repoResponse.data;

    const readmeContent = await fetchReadmeContent(githubRepoUrl);
    const summary = readmeContent ? await generateSummary(readmeContent) : null;

    const responseData = {
      repoInfo,
      readmeContent,
      summary,
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error fetching repository information:", error);
    res.status(500).json({ error: "Could not fetch repository information" });
  }
});

module.exports = router;
