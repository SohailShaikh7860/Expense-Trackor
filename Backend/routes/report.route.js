import express from "express";
import { authToken } from "../middleware/auth.js";
import { generateAllSimpleReports, generateAllTransportReports } from "../controllers/AiReportController.js";
import { transport } from "../config/nodeMailer.js";

const router = express.Router();

// Middleware to verify cron secret key
const verifyCronSecret = (req, res, next) => {
    const cronSecret = req.headers['x-cron-secret'] || req.query.secret;
    
    if (cronSecret !== process.env.CRON_SECRET) {
        return res.status(403).json({ 
            success: false, 
            message: 'Unauthorized: Invalid cron secret' 
        });
    }
    next();
};

// Public cron endpoints (protected by secret key)
router.post('/cron/simple-reports', verifyCronSecret, async (req, res) => {
    try {
        console.log('📧 Cron triggered: Generating simple expense reports...');
        const result = await generateAllSimpleReports();
        res.json({ 
            success: true, 
            message: 'Simple reports generated',
            sent: result.success,
            failed: result.failed
        });
    } catch (error) {
        console.error('Cron error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/cron/transport-reports', verifyCronSecret, async (req, res) => {
    try {
        console.log('🚛 Cron triggered: Generating transport reports...');
        const result = await generateAllTransportReports();
        res.json({ 
            success: true, 
            message: 'Transport reports generated',
            sent: result.success,
            failed: result.failed
        });
    } catch (error) {
        console.error('Cron error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Protected admin routes
router.use(authToken);

router.post('/generate-all-simple', generateAllSimpleReports);

router.post('/test-transport', generateAllTransportReports);

export default router;
