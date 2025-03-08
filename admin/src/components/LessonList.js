import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LessonListWithProblems = () => {
  const [lessons, setLessons] = useState([]);
  const [loadCount, setLoadCount] = useState(3); // Initial number of lessons to display
  const [visibleLessons, setVisibleLessons] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        // Fetch lessons from your API
        const lessonResponse = await axios.get('http://localhost:8085/api/lessons/all');
        const lessonsData = Object.values(lessonResponse.data);

        // Fetch problems from your API
        const problemResponse = await axios.get('http://localhost:8083/api/problems/all');
        const problemsData = Array.isArray(problemResponse.data) ? problemResponse.data : Object.values(problemResponse.data);

        // Map problems to their respective lessons
        const lessonsWithProblems = lessonsData.map(lesson => ({
          ...lesson,
          problem: problemsData.find(problem => problem.id === lesson.problemId) // Assuming there's a problemId association in your lesson data
        }));

        // Sort by created date, assuming both have a `createdAt` field
        lessonsWithProblems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setLessons(lessonsWithProblems);
        setVisibleLessons(lessonsWithProblems.slice(0, loadCount));
        setError(null);
      } catch (error) {
        console.error('Failed to fetch lessons:', error);
        setError('Failed to load lessons with problems.');
      }
    };

    fetchLessons();
  }, [loadCount]);

  const loadMore = () => {
    // Increase visible lessons by 3
    setVisibleLessons(lessons.slice(0, loadCount + 3));
    setLoadCount(prevCount => prevCount + 3);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Lesson List with Associated Problems</h2>
      <ul>
        {visibleLessons.map((lesson, index) => (
          <li key={lesson.id || index}>
            <strong>{lesson.topic}</strong>: {lesson.description}
            {lesson.problem && (
              <div>
                <strong>Problem:</strong>
                <div>Title: {lesson.problem.title}</div>
                <div>Type: {lesson.problem.problemType}</div>
                <div>Difficulty: {lesson.problem.problemDifficulty}</div>
                <div>Description: {lesson.problem.problemDescription}</div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {visibleLessons.length < lessons.length && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
};

export default LessonListWithProblems;