import dotenv from "dotenv";
import bodyParser from 'body-parser';

dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";

const app = express();
const port = 8081;

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`Auth-Service received: ${req.method} ${req.url}`);
  console.log(`Request Body:`, req.body);
  next();
});

app.use("/api/auth", authRoutes);

const server = app.listen(port, () => {
  console.log(`Auth-Service running on http://localhost:${port}`);
});

export default server;

