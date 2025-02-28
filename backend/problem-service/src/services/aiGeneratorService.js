import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

// when running test.ai.generator.service.js, replace it with raw API key
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
    } catch (err) {
      console.error(err);
      throw new Error('Failed to generate problem variant');
    }
  }
};

// Create the prompt for Gemini API request
function createPrompt(baseProblem, params) {
  return `
    Generate a new coding problem based on:
    Base Problem: ${JSON.stringify(baseProblem)}
    Variations: ${params.variationOptions.join(', ')}

    Output JSON format:
    {
      "title": "Problem Title",
      "description": "Problem Description",
      "difficulty": "Easy/Medium/Hard",
      "testCases": [{ "input": "...", "output": "..." }],
      "constraints": ["..."],
      "tags": ["..."]
    }
  `;
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
      baseProblemId: null,
      createdAt: new Date(),
      verified: false
    };
  } catch (err) {
    console.error('Error parsing Gemini response:', err);
    throw new Error('Invalid Gemini response format');
  }
}