import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config()
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import protect from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Initialize the app;
const app = express();

//connect to mongoDb
connectDB();

//using cors
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT' , 'DELETE'],
    credentials: true // to allow authorization headers
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));



//Routes
app.use('/api/auth' , authRoutes)
app.use(protect);


//connecting to the server

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})