import { config } from "../../config.ts";
const { prob } = config.api;

interface ProblemForm {
  problemType: string;
  problemDifficulty: number;
  tags: string[];
  userOptions: string;
}

interface Tag {
  tag: string;
  count: number;
}

export const generateProblem = async (formData: ProblemForm) => {
  try {
    const response = await fetch(`${prob}/problems/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      //credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to generate problem");
    }

    return response.json();
  } catch (err) {
    throw new Error("Failed to generate problem");
  }
};

export const getAllTags = async (): Promise<Tag[]> => {
  try {
    const response = await fetch(`${prob}/problems/all-tags`, {
      method: "GET",
      //credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tags");
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching tags:", err);
    return [];
  }
};

export const runCode = async (language, code, testCases) => {
  try {
    const response = await fetch(`${prob}/problems/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ language, code, testCases }),
      //credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to execute code");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error("Failed to execute code");
  }
};