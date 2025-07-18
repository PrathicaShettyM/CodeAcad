import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}));

app.use(morgan('dev'));
app.use(cookieParser());

// import all routes


// use all routes



// add middleware here later on

export default app;