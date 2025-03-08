import React, { useState } from 'react';
import axios from 'axios';

const AddProblem = () => {
  const [formData, setFormData] = useState({
    title: '',
    problemType: '',
    problemDifficulty: '',
    problemDescription: '',
    tags: '',
    verified: true
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, problemType, problemDifficulty, problemDescription, tags, verified } = formData;
    const formattedTags = tags.split(',').map(tag => tag.trim());

    try {
      const response = await axios.post('http://localhost:8083/api/problems/add', {
        title,
        problemType,
        problemDifficulty: parseInt(problemDifficulty),
        problemDescription,
        tags: formattedTags,
        testCases: {},
        constraints: [],
        createdAt: new Date(),
        verified
      });

      alert(response.data);
    } catch (error) {
      alert('Error adding problem: ' + error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Problem</h2>
      <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
      <input type="text" name="problemType" placeholder="Problem Type" onChange={handleChange} required />
      <input type="number" name="problemDifficulty" placeholder="Difficulty" onChange={handleChange} min="1" max="10" required />
      <textarea name="problemDescription" placeholder="Description" onChange={handleChange} required></textarea>
      <input type="text" name="tags" placeholder="Tags (comma separated)" onChange={handleChange} />
      <button type="submit">Add Problem</button>
    </form>
  );
};

export default AddProblem;