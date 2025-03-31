import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import problemRouter from './src/routes/problemRoutes.js';
import bodyParser from 'body-parser';

const app = express();
const port = 8083;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/problems', problemRouter);

const server = app.listen(8083, () => {
  console.log(`Problem Service running on http://localhost:8083`);
});

export default server;
