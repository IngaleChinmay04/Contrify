const express = require("express");
const router = express.Router();
const { fetchFileTree, fetchFileContent } = require("../helpers/github");
const { generateExplanation } = require("../helpers/generateExplanation");

router.get("/", async (req, res) => {
  const { repoUrl } = req.query;
  try {
    const languages = await fetchLanguages(repoUrl);
    const fileExtensionRegex = generateFileExtensionRegex(languages);
    const fileTree = await fetchFileTree(repoUrl);

    const codeFiles = fileTree.filter(
      (file) => file.type === "blob" && fileExtensionRegex.test(file.path)
    );

    const explanations = {};
    for (const file of codeFiles) {
      const content = await fetchFileContent(repoUrl, file.path);
      const explanation = await generateExplanation(content);
      explanations[file.path] = explanation;
    }

    res.json(explanations);
  } catch (error) {
    console.error("Error fetching and explaining code files:", error);
    res.status(500).json({ error: "Could not fetch and explain code files" });
  }
});

module.exports = router;
