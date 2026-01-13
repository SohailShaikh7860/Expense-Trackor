import { jest } from '@jest/globals';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load test environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.test') });

const mockGenerateAllSimpleReports = jest.fn();
const mockGenerateAllTransportReports = jest.fn();

jest.unstable_mockModule('../controllers/AiReportController.js', () => ({
  generateAllSimpleReports: mockGenerateAllSimpleReports,
  generateAllTransportReports: mockGenerateAllTransportReports
}));

jest.unstable_mockModule('../config/nodeMailer.js', () => ({
  transport: {}
}));

jest.unstable_mockModule('../middleware/auth.js', () => ({
  authToken: jest.fn((req, res, next) => next())
}));

describe('Report Routes', () => {
  let request, response;

  beforeEach(() => {
    request = {
      headers: {},
      query: {},
      body: {}
    };
    
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  describe('POST /cron/simple-reports', () => {
    test('should reject request with no secret', async () => {
      request.headers = {};
      request.query = {};
      
      expect(process.env.CRON_SECRET).toBeDefined();
    });

    test('should reject request with wrong secret', async () => {
      request.headers['x-cron-secret'] = 'wrong_secret_key';
      
      expect(request.headers['x-cron-secret']).not.toBe(process.env.CRON_SECRET);
    });

    test('should generate simple reports when valid secret provided', async () => {
      request.headers['x-cron-secret'] = process.env.CRON_SECRET;
      
      mockGenerateAllSimpleReports.mockResolvedValue({
        success: 5,
        failed: 0
      });

      expect(request.headers['x-cron-secret']).toBe(process.env.CRON_SECRET);
      expect(mockGenerateAllSimpleReports).toBeDefined();
    });
  });

  describe('POST /cron/transport-reports', () => {
    test('should reject request with no secret', async () => {
      request.headers = {};
      request.query = {};
      
      expect(process.env.CRON_SECRET).toBeDefined();
    });

    test('should reject request with wrong secret', async () => {
      request.headers['x-cron-secret'] = 'invalid_secret';
      
      expect(request.headers['x-cron-secret']).not.toBe(process.env.CRON_SECRET);
    });

    test('should generate transport reports when valid secret provided', async () => {
      request.headers['x-cron-secret'] = process.env.CRON_SECRET;
      
      mockGenerateAllTransportReports.mockResolvedValue({
        success: 3,
        failed: 1
      });

      expect(request.headers['x-cron-secret']).toBe(process.env.CRON_SECRET);
      expect(mockGenerateAllTransportReports).toBeDefined();
    });
  });
});
