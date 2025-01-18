const axios = require("axios");
const GITHUB_API_KEY = process.env.REACT_APP_GIT_API_KEY;

async function fetchReadmeContent(githubRepoUrl) {
  try {
    const response = await axios.get(`${githubRepoUrl}/readme`, {
      headers: { Authorization: `token ${GITHUB_API_KEY}` },
    });
    return response.data.content;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn("README not found");
      return null;
    } else {
      console.error("Error fetching README content:", error);
      throw new Error("Could not fetch README content");
    }
  }
}

async function fetchIssues(repoUrl) {
  try {
    const response = await axios.get(`${repoUrl}/issues`, {
      headers: { Authorization: `token ${GITHUB_API_KEY}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw new Error("Could not fetch issues");
  }
}

async function fetchFileTree(repoUrl) {
  try {
    const response = await axios.get(`${repoUrl}/git/trees/main?recursive=1`, {
      headers: { Authorization: `token ${GITHUB_API_KEY}` },
    });
    return response.data.tree;
  } catch (error) {
    console.error("Error fetching file tree:", error);
    throw new Error("Could not fetch file tree");
  }
}

async function fetchFileContent(repoUrl, path) {
  try {
    const response = await axios.get(`${repoUrl}/contents/${path}`, {
      headers: { Authorization: `token ${GITHUB_API_KEY}` },
    });
    return Buffer.from(response.data.content, "base64").toString("utf-8");
  } catch (error) {
    console.error(`Error fetching content for file "${path}":`, error);
    throw new Error(`Could not fetch content for file "${path}"`);
  }
}

module.exports = {
  fetchReadmeContent,
  fetchIssues,
  fetchFileTree,
  fetchFileContent,
};
