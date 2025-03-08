import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProblemAI = () => {
  const [problems, setProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [variationOptions, setVariationOptions] = useState('');
  const [generatedProblem, setGeneratedProblem] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get('http://localhost:8083/api/problems/all');
        setProblems(Array.isArray(response.data) ? response.data : Object.values(response.data));
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    fetchProblems();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (selectedProblem) {
      try {
        const response = await axios.post('http://localhost:8083/api/problems/generate', {
          ...selectedProblem,
          variationOptions: { option1: variationOptions }
        });

        setGeneratedProblem(response.data);
      } catch (error) {
        alert('Error generating problem: ' + error.response.data.error);
      }
    } else {
      alert('Please select a problem to generate a variation.');
    }
  };

  // Filter the problems based on the search query and limit to top 3 results
  const filteredProblems = problems
    .filter(problem => problem.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 3); // Modify this line to limit results to top 3

  return (
    <div>
      <h2>Generate Problem</h2>
      <input
        type="text"
        placeholder="Search problems by name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <div>
        {filteredProblems.map((problem) => (
          <div key={problem.id} className="problem-card">
            <h3>{problem.title}</h3>
            <button onClick={() => setSelectedProblem(problem)}>
              Select
            </button>
          </div>
        ))}
      </div>

      {selectedProblem && (
        <form onSubmit={handleGenerate}>
          <h3>Selected Problem: {selectedProblem.title}</h3>
          <input
            type="text"
            placeholder="Variation Options"
            value={variationOptions}
            onChange={(e) => setVariationOptions(e.target.value)}
            required
          />
          <button type="submit">Generate Problem</button>
        </form>
      )}

      {generatedProblem && (
        <div>
          <h3>Generated Problem</h3>
          <p>{generatedProblem.problemDescription}</p>
        </div>
      )}
    </div>
  );
};

export default ProblemAI;