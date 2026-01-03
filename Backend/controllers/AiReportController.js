import { analyzeSimpleExpenses, analyzeTransportExpenses } from "../service/AIAnalyzer.js";
import Expense from "../model/expense.model.js";
import User from "../model/user.model.js";
import { transport } from "../config/nodeMailer.js";

// Helper: Get expenses for a specific user and month
const getExpensesByUserAndMonth = async (userId, month, year) => {
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);
    
    return await Expense.find({
        userId,
        date: { $gte: startOfMonth, $lte: endOfMonth }
    }).sort({ date: -1 });
};


// Generate reports for all users with simple expenses (called by cron)
const generateAllSimpleReports = async () => {
    try {
        console.log("Starting monthly simple expense report generation...");
        
        const now = new Date();
        const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const lastYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];

        // Get all users
        const users = await User.find({});
        let successCount = 0;
        let failCount = 0;

        for (const user of users) {
            try {
                // Get user's expenses
                const expenses = await getExpensesByUserAndMonth(user._id, lastMonth, lastYear);
                
                if (expenses.length === 0) {
                    console.log(`No expenses for user ${user.name}, skipping...`);
                    continue;
                }

                // Analyze
                const analysis = await analyzeSimpleExpenses(
                    expenses, 
                    monthNames[lastMonth], 
                    lastYear, 
                    user.name
                );

                if (!analysis.success) {
                    console.error(`AI analysis failed for user ${user.name}`);
                    failCount++;
                    continue;
                }

                // Send email
                const emailContent = monthlyReportTemplate({
                    userName: user.name,
                    month: monthNames[lastMonth],
                    year: lastYear,
                    analysis: analysis.analysis,
                    stats: analysis.stats,
                    reportType: 'personal'
                });

                await transport.sendMail({
                    to: user.email,
                    subject: `Your Monthly Expense Report - ${monthNames[lastMonth]} ${lastYear}`,
                    html: emailContent
                });

                console.log(`✅ Report sent to ${user.name} (${user.email})`);
                successCount++;

            } catch (error) {
                console.error(`Failed to send report to ${user.name}:`, error.message);
                failCount++;
            }
        }

        console.log(`Report generation complete. Success: ${successCount}, Failed: ${failCount}`);
        return { success: successCount, failed: failCount };

    } catch (error) {
        console.error("Generate all reports error:", error);
        throw error;
    }
};

export {
    generateSimpleExpenseReport,
    generateAllSimpleReports
};