import express from 'express';
import { addLesson, getLessonsByTopic, getAllLessons } from '../controllers/lessonController.js';

export const lessonRouter = express.Router();

// POST route to add a new lesson
lessonRouter.post('/add', addLesson);

// GET route to fetch lessons by topic
lessonRouter.get('/topic', getLessonsByTopic);

// GET route to get all lessons
lessonRouter.get('/all', getAllLessons);

export default lessonRouter;