import express from 'express';
import problemController from '../controllers/problemController.js';

export const problemRouter = express.Router();

problemRouter.post('/problems', problemController.generateProblem);
// problemRouter.get('/problems', problemController.getProblems);

export default problemRouter;