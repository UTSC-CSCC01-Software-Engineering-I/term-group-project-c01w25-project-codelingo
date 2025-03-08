import database from '../../../shared/firebaseConfig.js';
import { ref, push, query, orderByChild, equalTo, get } from 'firebase/database';

// Allowable topic types: Customize these as needed


// Add a lesson
export const addLesson = async (req, res) => {
  const { topic, description, problemDifficulty, problemType, problemTags } = req.body;

  if (!topic || !description) {
    return res.status(400).send('Fields (topic, description) are required.');
  }



  try {
    // Fetch problems directly from Firebase rather than using an external API
    const problemsRef = ref(database, 'problems');

    // Create a query based on specified parameters
    const problemsQuery = query(
      problemsRef,
      orderByChild('problemDifficulty'),
      equalTo(problemDifficulty)
    );

    const snapshot = await get(problemsQuery);
    if (!snapshot.exists()) {
      return res.status(404).send('No problems found for the specified parameters.');
    }

    const filteredProblems = [];
    snapshot.forEach(childSnapshot => {
      const problem = childSnapshot.val();
      if (problem.problemType === problemType && problemTags.some(tag => problem.tags.includes(tag))) {
        filteredProblems.push(problem);
      }
    });

    if (filteredProblems.length === 0) {
      return res.status(404).send('No problems found matching the criteria.');
    }

    const newLessonRef = ref(database, 'lessons');
    await push(newLessonRef, {
      topic,
      description,
      associatedProblems: filteredProblems,
    });

    res.status(201).send('Lesson added successfully.');
  } catch (error) {
    console.error('Error adding lesson:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Get lessons by topic
export const getLessonsByTopic = (req, res) => {
  const { topic } = req.query;

  if (!topic) {
    return res.status(400).send('Topic is required.');
  }

  const lessonsRef = ref(database, 'lessons');
  const topicQuery = query(lessonsRef, orderByChild('topic'), equalTo(topic));

  get(topicQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        res.status(200).json(snapshot.val());
      } else {
        res.status(404).send('No lessons found for the specified topic.');
      }
    })
    .catch((error) => {
      console.error('Error fetching lessons by topic:', error);
      res.status(500).send('Internal Server Error');
    });
};

// Get all lessons
export const getAllLessons = async (req, res) => {
  const lessonsRef = ref(database, 'lessons');

  try {
    const snapshot = await get(lessonsRef);
    if (!snapshot.exists()) {
      return res.status(404).send('No lessons found.');
    }

    const allLessons = snapshot.val();
    res.status(200).json(allLessons);
  } catch (error) {
    console.error('Error fetching all lessons:', error);
    res.status(500).send('Internal Server Error');
  }
};