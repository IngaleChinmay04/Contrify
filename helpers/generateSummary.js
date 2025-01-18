const model = require("../models/googleGenerativeAI");

async function generateSummary(text) {
  try {
    const result = await model.generateContent(
      text +
        " Generate a summary of the text content of the readme file, ignoring any formatting, code snippets, and images. Focus only on the textual information."
    );
    const response = await result.response;
    return await response.text();
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Could not generate summary");
  }
}

module.exports = { generateSummary };
