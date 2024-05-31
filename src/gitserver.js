require("dotenv").config({
  path: "C:\\Users\\dell inspiron\\Desktop\\EDAI FINAL\\opensourcenavigator\\.env",
});
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));

const PORT = process.env.PORT || 5000;

// const GITHUB_API_URL = "https://api.github.com/repos/meta-llama/llama3";
const GITHUB_API_KEY = process.env.REACT_APP_GIT_API_KEY;
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
// Function to fetch README content from GitHub
async function fetchReadmeContent(githubRepoUrl) {
  try {
    const response = await axios.get(`${githubRepoUrl}/readme`, {
      headers: {
        Authorization: `token ${GITHUB_API_KEY}`,
      },
    });
    return response.data.content;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn("README not found");
      return null; // Return null if README doesn't exist
    } else {
      console.error("Error fetching README content:", error);
      throw new Error("Could not fetch README content");
    }
  }
}

// Function to generate summary using Gemini AI
async function generateSummary(text) {
  try {
    // const genAI = new GoogleGenerativeAI(
    //   "AIzaSyAXw_8Zorr7k8iL7QMfgFTvJiTuhNqYsc0"
    // );
    // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(
      text +
        "Generate a summary of the text content of the readme file, ignoring any formatting, code snippets, and images. Focus only on the textual information."
    );
    const response = await result.response;
    const summary = await response.text();
    // console.log(summary);
    return summary;
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Could not generate summary");
  }
}

app.get("/repo-info", async (req, res) => {
  try {
    const githubRepoUrl = req.query.url;
    const repoResponse = await axios.get(githubRepoUrl, {
      headers: {
        Authorization: `token ${GITHUB_API_KEY}`,
      },
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

// Function to fetch labels from the GitHub repository
async function fetchLabels() {
  try {
    const response = await axios.get(`${GITHUB_API_URL}/labels`, {
      headers: {
        Authorization: `token ${GITHUB_API_KEY}`,
      },
    });
    return response.data.map((label) => label.name);
  } catch (error) {
    console.error("Error fetching labels:", error);
    throw new Error("Could not fetch labels");
  }
}

// Function to fetch issues based on a label
async function fetchIssuesByLabel(label) {
  try {
    const response = await axios.get(`${GITHUB_API_URL}/issues`, {
      headers: {
        Authorization: `token ${GITHUB_API_KEY}`,
      },
      params: {
        labels: label,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching issues by label "${label}":`, error);
    throw new Error(`Could not fetch issues by label "${label}"`);
  }
}

// Endpoint to fetch and classify issues based on labels dynamically
// Endpoint to fetch all issues from the repository
// Endpoint to fetch all issues from the repository
app.get("/repo-issues", async (req, res) => {
  try {
    const { repoUrl } = req.query;
    const response = await axios.get(`${repoUrl}/issues`);
    const issues = response.data;
    res.json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ error: "Could not fetch issues" });
  }
});

app.get("/code-files", async (req, res) => {
  const { repoUrl } = req.query;
  try {
    const languages = await fetchLanguages(repoUrl);
    const fileExtensionRegex = generateFileExtensionRegex(languages);

    if (!fileExtensionRegex) {
      throw new Error("No valid file extensions found based on languages");
    }

    const fileTree = await fetchFileTree(repoUrl);
    const codeFiles = fileTree.filter(
      (file) => file.type === "blob" && fileExtensionRegex.test(file.path)
    );

    res.json(codeFiles.map((file) => file.path));
  } catch (error) {
    console.error("Error fetching code files:", error);
    res.status(500).json({ error: "Could not fetch code files" });
  }
});

app.post("/explain-code-file", async (req, res) => {
  try {
    const { repoUrl, filePath } = req.body;
    const content = await fetchFileContent(repoUrl, filePath);
    const explanation = await generateExplanation(content);
    res.json({ explanation });
  } catch (error) {
    console.error(`Error explaining code file "${filePath}":`, error);
    res
      .status(500)
      .json({ error: `Could not explain code file "${filePath}"` });
  }
});

// Function to fetch the repository's file tree
async function fetchFileTree(repoUrl) {
  try {
    const response = await axios.get(`${repoUrl}/git/trees/main?recursive=1`, {
      headers: {
        Authorization: `token ${GITHUB_API_KEY}`,
      },
    });
    return response.data.tree;
  } catch (error) {
    console.error("Error fetching file tree:", error);
    throw new Error("Could not fetch file tree");
  }
}

// Function to fetch file content
async function fetchFileContent(repoUrl, path) {
  try {
    const response = await axios.get(`${repoUrl}/contents/${path}`, {
      headers: {
        Authorization: `token ${GITHUB_API_KEY}`,
      },
    });
    // Content is base64 encoded
    return Buffer.from(response.data.content, "base64").toString("utf-8");
  } catch (error) {
    console.error(`Error fetching content for file "${path}":`, error);
    throw new Error(`Could not fetch content for file "${path}"`);
  }
}

// Function to generate explanation using Gemini AI
async function generateExplanation(text) {
  try {
    // const genAI = new GoogleGenerativeAI(
    //   "AIzaSyAXw_8Zorr7k8iL7QMfgFTvJiTuhNqYsc0"
    // );
    // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(
      text +
        " Explain the code in detail, focusing on its functionality and purpose."
    );
    const response = await result.response;
    const explanation = await response.text();
    // console.log(explanation);
    return explanation;
  } catch (error) {
    console.error("Error generating explanation:", error);
    throw new Error("Could not generate explanation");
  }
}

// Function to fetch languages from the GitHub repository
async function fetchLanguages(repoUrl) {
  try {
    const response = await axios.get(`${repoUrl}/languages`, {
      headers: {
        Authorization: `token ${GITHUB_API_KEY}`,
      },
    });
    return Object.keys(response.data);
  } catch (error) {
    console.error("Error fetching languages:", error);
    throw new Error("Could not fetch languages");
  }
}
// function generateFileExtensionRegex(languages) {
//   const extensions = languages.map((lang) => mime.getType(lang)); // Use mime library
//   const filteredExtensions = extensions.filter((ext) => ext); // Filter out undefined types
//   if (filteredExtensions.length === 0) {
//     return null;
//   }
//   // Extract only the extension part from the MIME type (e.g., "text/javascript" -> "js")
//   const fileExtensions = filteredExtensions.map((ext) => ext.split("/")[1]);
//   return new RegExp(`\\.(${fileExtensions.join("|")})$`); // Join extensions with "|" for regex pattern
// }

// Function to generate a regex pattern for file extensions based on languages
function generateFileExtensionRegex(languages) {
  const languageExtensions = {
    JavaScript: "js",
    Python: "py",
    Java: "java",
    "C++": "cpp",
    C: "c",
    "C#": "cs",
    HTML: "html",
    CSS: "css",
    PHP: "php",
    Ruby: "rb",
    Go: "go",
    Swift: "swift",
    Kotlin: "kt",
    TypeScript: "ts",
    Shell: "sh",
    R: "r",
    Perl: "pl",
    Rust: "rs",
    Scala: "scala",
    Haskell: "hs",
    Lua: "lua",
  };

  const extensions = languages
    .map((lang) => languageExtensions[lang])
    .filter((ext) => ext);
  if (extensions.length === 0) {
    return null;
  }
  return new RegExp(`\\.(${extensions.join("|")})$`);
}

// Endpoint to fetch and explain code files
app.get("/repo-code-explainer", async (req, res) => {
  const { repoUrl } = req.query;
  try {
    const languages = await fetchLanguages(repoUrl);
    // console.log("Fetched languages:", languages); // Log fetched languages

    const fileExtensionRegex = generateFileExtensionRegex(languages);
    // console.log("Generated file extension regex:", fileExtensionRegex); // Log generated regex

    if (!fileExtensionRegex) {
      throw new Error("No valid file extensions found based on languages");
    }

    const fileTree = await fetchFileTree(repoUrl);
    // console.log("Fetched file tree:", fileTree); // Log the file tree

    // Filter for code files using the dynamically generated regex
    const codeFiles = fileTree.filter(
      (file) => file.type === "blob" && fileExtensionRegex.test(file.path)
    );
    // console.log("Filtered code files:", codeFiles); // Log filtered code files

    const explanations = {};
    for (const file of codeFiles) {
      // console.log("Fetching content for file:", file.path); // Log file being fetched
      const content = await fetchFileContent(file.path);
      // console.log("Fetched content for file:", file.path); // Log fetched content
      const explanation = await generateExplanation(content);
      explanations[file.path] = explanation;
    }

    res.json(explanations);
  } catch (error) {
    console.error("Error fetching and explaining code files:", error);
    res.status(500).json({ error: "Could not fetch and explain code files" });
  }
});

// Function to generate explanation for an issue using Gemini AI
// Function to generate explanation for an issue using Gemini AI
// Function to generate explanation for an issue using Gemini AI
// Function to generate explanation for an issue using Gemini AI
// Function to generate explanation for an issue using Gemini AI
async function generateIssueExplanation(issueDetails) {
  try {
    // console.log("Issue details:", issueDetails.title, issueDetails.body); // Log issue details
    // Check if issue details are valid and complete
    // if (!issueDetails || !issueDetails.title || !issueDetails.body) {
    //   throw new Error("Issue details are invalid or incomplete");
    // }

    // Use the issue title and body to generate an explanation

    const result = await model.generateContent(
      `${issueDetails.title} and ${issueDetails.body}. Explain this issue and also tell the probable solution.`
    );
    const response = await result.response;
    const explanation = await response.text();
    // console.log("Generated explanation:", explanation); // Log generated explanation
    return explanation;
  } catch (error) {
    console.error("Error generating issue explanation:", error);
    throw new Error(
      "Unable to generate explanation for the issue. Please try again later."
    );
  }
}

// Endpoint to explain an issue
// Endpoint to explain an issue
// Endpoint to explain an issue
// Endpoint to explain an issue
app.post("/explain-issue", async (req, res) => {
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
// Function to fetch issue details by issue number from the GitHub repository
async function fetchIssueDetails(repoUrl, issueNumber) {
  try {
    const response = await axios.get(`${repoUrl}/issues/${issueNumber}`, {
      headers: {
        Authorization: `token ${GITHUB_API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching issue details for issue ${issueNumber}:`,
      error
    );
    throw new Error(`Could not fetch issue details for issue ${issueNumber}`);
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
