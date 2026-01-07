import cron from 'node-cron';
import { generateAllSimpleReports, generateAllTransportReports } from '../controllers/AiReportController.js';

// Initialize all cron jobs
export const initializeCronJobs = () => {
    console.log('🕐 Initializing cron jobs...');

    // simple expense reports on the 1st of every month at 9:00 AM
    cron.schedule('0 9 1 * *', async () => {
        console.log('\n⏰ Running scheduled simple expense reports...');
        try {
            const result = await generateAllSimpleReports();
            console.log(`✅ Simple reports completed: ${result.success} sent, ${result.failed} failed`);
        } catch (error) {
            console.error('❌ Error in simple reports cron:', error.message);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata" // Change to your timezone
    });

    // transport reports on the 1st of every month at 10:00 AM
    cron.schedule('0 10 1 * *', async () => {
        console.log('\n⏰ Running scheduled transport reports...');
        try {
            const result = await generateAllTransportReports();
            console.log(`✅ Transport reports completed: ${result.success} sent, ${result.failed} failed`);
        } catch (error) {
            console.error('❌ Error in transport reports cron:', error.message);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata" // Change to your timezone
    });

    console.log('✅ Cron jobs initialized successfully!');
};


// For testing purposes: a cron that runs every minute
// export const startTestCron = () => {
//     console.log('⚠️  Starting TEST cron (runs every minute)...');
    
//     cron.schedule('* * * * *', async () => {
//         try {
//             const result = await generateAllTransportReports();
//             console.log(`✅ Test completed: ${result.success} sent, ${result.failed} failed`);
//         } catch (error) {
//             console.error('❌ Test error:', error.message);
//         }
//     });
// };

/*
CRON SCHEDULE FORMAT:
┌────────────── second (optional)
│ ┌──────────── minute (0 - 59)
│ │ ┌────────── hour (0 - 23)
│ │ │ ┌──────── day of month (1 - 31)
│ │ │ │ ┌────── month (1 - 12)
│ │ │ │ │ ┌──── day of week (0 - 7) (Sunday = 0 or 7)
│ │ │ │ │ │
│ │ │ │ │ │
* * * * *
*/
