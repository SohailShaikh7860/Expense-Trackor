import express from 'express';
import router from './routes/user.routes.js';  
import tripRouter from './routes/trip.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

const originalUrl = process.env.FRONTEND || 'http://localhost:5173';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: originalUrl,
    credentials: true,
}));


app.get('/', (req, res) => {
  res.send('Expense Tracker Backend is running');
});
// app.use(express.text({ type: ['text/*'] })); // Commented out - was interfering with JSON body parsing

app.use('/user', router);
app.use('/trip', tripRouter);

export default app;