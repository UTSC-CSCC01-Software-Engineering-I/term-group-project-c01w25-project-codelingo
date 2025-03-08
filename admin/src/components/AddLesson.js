import React, { useState } from 'react'; 
import axios from 'axios';

const AddLesson = () => {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [type, setType] = useState('');
  const [tags, setTags] = useState('');
  const [notification, setNotification] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedTags = tags.split(',').map(tag => tag.trim());

    const newLesson = {
      topic,
      description,
      problemDifficulty: parseInt(difficulty, 10), // Ensure numeric type
      problemType: type,
      problemTags: formattedTags
    };

    try {
      const response = await axios.post('http://localhost:8085/api/lessons/add', newLesson);
      if (response.status === 201) {
        setNotification('Lesson added successfully.');
      } else {
        setNotification('Failed to add lesson.');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setNotification('Fields (topic, description) are required.');
      } else {
        setNotification('Error adding the lesson');
      }
      console.error('Error:', error);
    }
  };

  const fillDefaults = () => {
    setTopic('Math');
    setDescription('A basic algebra lesson');
    setDifficulty('5');
    setType('typeA');
    setTags('array, loop');
  };

  return (
    <div>
      <h2>Add New Lesson</h2>
      <button onClick={fillDefaults}>Use Sample Data</button>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Topic:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Difficulty Level:</label>
          <input
            type="number" // Ensure consistency with the expected type
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Problem Type:</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Tags (comma separated):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <button type="submit">Add Lesson</button>
      </form>
      {notification && <p>{notification}</p>}
    </div>
  );
};

export default AddLesson;