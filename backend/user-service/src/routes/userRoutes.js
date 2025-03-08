import express from 'express';
import userController from '../controllers/userController.js';

export const userRouter = express.Router();

userRouter.post('/discussion', userController.createDiscussion);
userRouter.get('/discussion', userController.getDiscussion);
userRouter.patch('/discussion/:id', userController.modifyDiscussion);

export default userRouter;