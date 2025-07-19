import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import errorMiddleware from "./src/middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}));

app.use(morgan('dev'));
app.use(cookieParser());

// import all routes
import userRoutes from './src/routes/user.routes.js';
import miscRoutes from './src/routes/miscellaneous.routes.js';
import courseRoutes from './src/routes/course.routes.js';
// import paymentRoutes from './src/routes/payment.routes.js';


// use all routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1', miscRoutes);
app.use('/api/v1/courses', courseRoutes);
// app.use('/api/v1/payments', paymentRoutes);

app.use(errorMiddleware);

export default app;