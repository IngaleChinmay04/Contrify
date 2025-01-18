const model = require("../models/googleGenerativeAI");

async function generateExplanation(text) {
  try {
    const result = await model.generateContent(
      text +
        " Explain the code in detail, focusing on its functionality and purpose."
    );
    const response = await result.response;
    return await response.text();
  } catch (error) {
    console.error("Error generating explanation:", error);
    throw new Error("Could not generate explanation");
  }
}

async function generateIssueExplanation(issueDetails) {
  try {
    const result = await model.generateContent(
      `${issueDetails.title} and ${issueDetails.body}. Explain this issue and also tell the probable solution.`
    );
    const response = await result.response;
    return await response.text();
  } catch (error) {
    console.error("Error generating issue explanation:", error);
    throw new Error(
      "Unable to generate explanation for the issue. Please try again later."
    );
  }
}

module.exports = { generateExplanation, generateIssueExplanation };
