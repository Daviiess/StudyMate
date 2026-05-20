import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config()
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import protect from './middleware/auth.js';
import documentRoutes from './routes/documentRoutes.js';
import flashcardRoutes from './routes/flashcardRoutes.js';
import quizRoutes from './routes/quizRoutes.js'
import aiRoutes from './routes/aiRoutes.js';
import progressRoutes from './routes/progressRoutes.js';

import errorHandler from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Initialize the app;
const app = express();

//connect to mongoDb
connectDB();

//using cors
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));



//Routes
app.use('/api/auth' , authRoutes)
app.use('/api/documents' , documentRoutes)
app.use('/api/flashcards' , flashcardRoutes);
app.use('/api/quizzes' , quizRoutes);
app.use('/api/ai' , aiRoutes);
app.use('/api/progress', progressRoutes);
app.use(protect);

app.use(errorHandler)

//connecting to the server

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})