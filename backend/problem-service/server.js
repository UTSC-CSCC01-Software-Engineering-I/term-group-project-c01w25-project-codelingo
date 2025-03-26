import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import problemRouter from './src/routes/problemRoutes.js';
import bodyParser from 'body-parser';

const app = express();
const port = 8083;

const corsConfig = {
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
};
app.use(cors(corsConfig));
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/problems', problemRouter);

app.listen(port, () => {
  console.log(`Problem Service running on http://localhost:${port}`);
});

export default app;
