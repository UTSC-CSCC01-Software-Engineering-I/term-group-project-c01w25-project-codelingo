import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';

const app = express();
const port = 8081;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Auth Service running on http://localhost:${port}`);
});
