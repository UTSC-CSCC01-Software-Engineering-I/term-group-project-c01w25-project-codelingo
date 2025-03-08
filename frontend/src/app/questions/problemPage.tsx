import React, { useState } from 'react';
import { generateProblem } from './problemApi';  // questionApiからインポート

interface ProblemForm {
  title: string;
  description: string;
  variationOptions: string[];
}

const ProblemPage = () => {
  const [formData, setFormData] = useState<ProblemForm>({
    title: '',
    description: '',
    variationOptions: [],
  });
  const [generatedProblem, setGeneratedProblem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleVariationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      variationOptions: value.split(',').map((option) => option.trim()),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await generateProblem(formData);
      setGeneratedProblem(data);
    } catch (err) {
      setError('Failed to generate question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create New Question</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="variationOptions">Variation Options</label>
          <input
            type="text"
            id="variationOptions"
            name="variationOptions"
            value={formData.variationOptions.join(', ')}
            onChange={handleVariationChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>Generate</button>
      </form>

      {loading && <p>Generating...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {generatedProblem && (
        <div>
          <h2>Question</h2>
          <pre>{JSON.stringify(generatedProblem, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ProblemPage;