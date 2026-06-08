require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

const generateCandidateSummary = async (
    job,
    resumeText,
    matchedSkills,
    missingSkills,
    score
) => {

    const prompt = `
You are an AI recruitment assistant.

Job Title:
${job.title}

Job Description:
${job.description}

Matched Skills:
${matchedSkills.join(", ")}

Missing Skills:
${missingSkills.join(", ")}

Match Score:
${score}%

Resume:
${resumeText}

Write a professional recruiter summary in 4-5 lines.
Mention strengths, weaknesses, skill fit, and recommendation.
`;

    const result = await model.generateContent(prompt);

    return result.response.text();
};

module.exports = generateCandidateSummary;