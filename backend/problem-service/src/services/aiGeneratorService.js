import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default {
  async generateVariant(baseProblem, params) {
    try {
      const prompt = createPrompt(baseProblem, params);

      // Gemini API request
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      if (!text || text.length === 0) {
        throw new Error('Gemini API response is empty');
      }

      // Clean up the response (if needed)
      const cleanedResponse = cleanResponse(text);

      // Parse the cleaned response into JSON
      return parseResponse(cleanedResponse);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to generate problem variant');
    }
  }
};

// Create the prompt for Gemini API request
function createPrompt(baseProblem, params) {
  const userOption = params.userOption || "";

  let prompt = `
    Generate a new problem based on:
    Base Problem: ${JSON.stringify(baseProblem)}
    That has the type: ${baseProblem.problemType} and difficulty: ${baseProblem.problemDifficulty}
    The user wants the question to be:
    ${userOption}
  `;

  // Adjust prompt for different problem types
  if (baseProblem.problemType === "coding") {
    prompt += `
      Output JSON format:
      {
        "title": "Problem Title",
        "problemType": "coding",
        "problemDifficulty": "1/2/3/4/5/6/7/9/10",
        "problemDescription": "Problem Description",
        "testCases": [{ "input": { arg name: value, ... }, "output": "..." }],
        "constraints": ["..."],
        "options": [empty],
        "correctAnswer": "empty",
        "tags": ["..."]
      }
    `;
  } else if (baseProblem.problemType === "mcq") {
    prompt += `
      Multiple choice question with only one true answer
      Output JSON format:
      {
        "title": "Question Title",
        "problemType": "mcq",
        "problemDifficulty": "1/2/3/4/5/6/7/9/10",
        "problemDescription": "Question Text",
        "testCases": [empty],
        "constraints": [empty],
        "options": [
          { "option": "Option A", "isCorrect": true/false },
          { "option": "Option B", "isCorrect": true/false },
          { "option": "Option C", "isCorrect": true/false },
          { "option": "Option D", "isCorrect": true/false }
        ],
        "correctAnswer": "empty",
        "tags": ["..."]
      }
    `;
  } else if (baseProblem.problemType === "fill") {
    prompt += `
      Output JSON format:
      {
        "title": "Fill in the Blank Question Title",
        "problemType": "fill",
        "problemDifficulty": "1/2/3/4/5/6/7/9/10",
        "problemDescription": "Fill in the blank with the correct answer",
        "testCases": [empty],
        "constraints": [empty],
        "options": [{empty}],
        "correctAnswer": "Correct Answer",
        "tags": ["..."]
      }
    `;
  } else {
    prompt += `
      Output JSON format:
      {
        "error": "Unknown problem type"
      }
    `;
  }

  return prompt;
}

// Clean the response string (to remove unwanted characters, code blocks, etc.)
function cleanResponse(responseText) {
  // If the response contains markdown code blocks or backticks, remove them
  let cleaned = responseText.replace(/```json([\s\S]*?)```/g, '$1');
  cleaned = cleaned.replace(/`/g, '');  // Remove any remaining backticks

  return cleaned;
}

// Parse the cleaned response into JSON
function parseResponse(response) {
  try {
    const problem = JSON.parse(response);
    return {
      ...problem,
      createdAt: new Date(),
      verified: false
    };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    throw new Error('Invalid Gemini response format');
  }
}