import express from 'express';
import router from './routes/user.routes.js';  
import tripRouter from './routes/trip.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// ✅ Allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND
].filter(Boolean); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {

        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('❌ CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));


app.get('/', (req, res) => {
  res.send('Expense Tracker Backend is running');
});
// app.use(express.text({ type: ['text/*'] })); // Commented out - was interfering with JSON body parsing

app.use('/user', router);
app.use('/trip', tripRouter);

export default app;