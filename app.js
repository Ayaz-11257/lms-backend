import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from'dotenv';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js'
import courseRoutes from './routes/course.route.js'
import paymentRoutes from './routes/payment.route.js'
import errorMiddleware from './middleware/error.middleware.js';
import miscRoute from './routes/miscellaneous.route.js';
config();

const app =  express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    // origin: [process.env.FRONTEND_URL],
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(cookieParser());

app.use(morgan('dev'));

app.use('/ping', function(req, res){
    res.send('/pong')
});

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/courses', courseRoutes)
app.use('/api/v1/payments', paymentRoutes)
app.use('/api/v1', miscRoute);

app.use(errorMiddleware);

export default app;