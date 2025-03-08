import { config } from '../../config.ts';
const { prob } = config.api;

interface ProblemForm {
    problemType: string;
    problemDifficulty: number;
    tags: string[];
    userOptions: string;
  }
  
export const generateProblem = async (formData: ProblemForm) => {
try {
    const response = await fetch(`${prob}/problems/generate`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
    credentials: 'include'
    });

    if (!response.ok) {
    throw new Error('Failed to generate problem');
    }

    return response.json();
} catch (err) {
    throw new Error('Failed to generate problem');
}
};
