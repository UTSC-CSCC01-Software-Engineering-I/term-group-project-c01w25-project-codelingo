import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [visibleProblems, setVisibleProblems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadCount, setLoadCount] = useState(3); // Initial count of problems to load

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get('http://localhost:8083/api/problems/all');
        
        const data = response.data;
        const parsedProblems = Array.isArray(data) ? data : Object.values(data);
        
        // Sort problems so that the most recently added appear at the top if createdAt date is available
        parsedProblems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setProblems(parsedProblems);

        // Initialize the visible problems with the first loadCount problems
        setVisibleProblems(parsedProblems.slice(0, loadCount));

        setError(null);
      } catch (error) {
        console.error('Error fetching problems:', error);
        setError('Error fetching problems');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [loadCount]);

  const loadMore = () => {
    // Increase load count by 3 and update visible problems
    setLoadCount((prevCount) => prevCount + 3);
    setVisibleProblems(problems.slice(0, loadCount + 3));
  };

  if (loading) {
    return <div>Loading problems...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Existing Problems</h2>
      {visibleProblems.length === 0 ? (
        <div>No problems found.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Type</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {visibleProblems.map((problem, index) => (
              <tr key={problem.id || index}>
                <td>{problem.title}</td>
                <td>{problem.problemDescription}</td>
                <td>{problem.problemType}</td>
                <td>{problem.problemDifficulty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {visibleProblems.length < problems.length && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
};

export default ProblemList;