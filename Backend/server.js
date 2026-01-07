import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './DB/Db.js';
import { initializeCronJobs } from './config/cronJobs.js';
dotenv.config();

const PORT = process.env.PORT || 8001;

connectDB();

// Initialize cron jobs for automated reports
initializeCronJobs();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});