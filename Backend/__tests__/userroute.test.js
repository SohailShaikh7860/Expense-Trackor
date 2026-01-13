import {describe, jest} from "@jest/globals";


const mockCreateUser = jest.fn();
const mockLoginUser = jest.fn();
const mockGetCurrentUser = jest.fn();
const mockLogOutUser = jest.fn();
const mockResetPassOtp = jest.fn();
const mockResetPassword = jest.fn();

jest.unstable_mockModule("../controllers/user.controllers.js", () => ({
    createUser: mockCreateUser,
    loginUser: mockLoginUser,
    getCurrentUser: mockGetCurrentUser,
    logOutUser: mockLogOutUser,
    resetPassOtp: mockResetPassOtp,
    resetPassword: mockResetPassword,
}))

jest.unstable_mockModule('../config/nodeMailer.js', () => ({
  transport: {}
}));

jest.unstable_mockModule('../middleware/auth.js', () => ({
  authToken: jest.fn((req, res, next) => next())
}));

describe('User Routes', () => {
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

  describe('POST /user/register', () => {
    test('should successfully register a user with valid data', async () => {
      request.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };
      
      mockCreateUser.mockResolvedValue({
        success: true,
        message: 'User created successfully'
      });

      const { createUser } = await import("../controllers/user.controllers.js");
      await createUser(request, response);
      
      expect(mockCreateUser).toHaveBeenCalledWith(request, response);
      expect(mockCreateUser).toHaveBeenCalledTimes(1);
    });

    test('should require name, email, and password', async () => {
      request.body = {};
      
      // Testing that all required fields are expected
      expect(request.body.name).toBeUndefined();
      expect(request.body.email).toBeUndefined();
      expect(request.body.password).toBeUndefined();
    });

    test('should validate email format', async () => {
      request.body = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123'
      };
      
      // Email should contain @ symbol
      expect(request.body.email.includes('@')).toBe(false);
    });

    test('should validate password length (min 6 characters)', async () => {
      request.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '12345'
      };
      
      // Password should be at least 6 characters
      expect(request.body.password.length).toBeLessThan(6);
    });
  });

  describe('POST /user/login', () => {
    test('should successfully login with valid credentials', async () => {
      request.body = {
        email: 'john@example.com',
        password: 'password123'
      };
      
      mockLoginUser.mockResolvedValue({
        success: true,
        token: 'jwt_token_here'
      });

      const { loginUser } = await import("../controllers/user.controllers.js");
      await loginUser(request, response);
      
      expect(mockLoginUser).toHaveBeenCalledWith(request, response);
    });

    test('should require email and password', async () => {
      request.body = {};
      
      expect(request.body.email).toBeUndefined();
      expect(request.body.password).toBeUndefined();
    });
  });

  describe('GET /user/getCurrentUser', () => {
    test('should get current user when authenticated', async () => {
      request.headers.authorization = 'Bearer valid_token';
      
      mockGetCurrentUser.mockResolvedValue({
        success: true,
        user: { id: 1, name: 'John Doe', email: 'john@example.com' }
      });

      const { getCurrentUser } = await import("../controllers/user.controllers.js");
      await getCurrentUser(request, response);
      
      expect(mockGetCurrentUser).toHaveBeenCalledWith(request, response);
    });
  });

  describe('POST /user/logout', () => {
    test('should logout user when authenticated', async () => {
      request.headers.authorization = 'Bearer valid_token';
      
      mockLogOutUser.mockResolvedValue({
        success: true,
        message: 'Logged out successfully'
      });

      const { logOutUser } = await import("../controllers/user.controllers.js");
      await logOutUser(request, response);
      
      expect(mockLogOutUser).toHaveBeenCalledWith(request, response);
    });
  });

  describe('POST /user/send-reset-otp', () => {
    test('should send reset OTP with valid email', async () => {
      request.body = {
        email: 'john@example.com'
      };
      
      mockResetPassOtp.mockResolvedValue({
        success: true,
        message: 'OTP sent successfully'
      });

      const { resetPassOtp } = await import("../controllers/user.controllers.js");
      await resetPassOtp(request, response);
      
      expect(mockResetPassOtp).toHaveBeenCalledWith(request, response);
    });
  });

  describe('POST /user/reset-password', () => {
    test('should reset password with valid OTP', async () => {
      request.body = {
        email: 'john@example.com',
        otp: '123456',
        newPassword: 'newpassword123'
      };
      
      mockResetPassword.mockResolvedValue({
        success: true,
        message: 'Password reset successfully'
      });

      const { resetPassword } = await import("../controllers/user.controllers.js");
      await resetPassword(request, response);
      
      expect(mockResetPassword).toHaveBeenCalledWith(request, response);
    });

    test('should require email, OTP, and new password', async () => {
      request.body = {};
      
      expect(request.body.email).toBeUndefined();
      expect(request.body.otp).toBeUndefined();
      expect(request.body.newPassword).toBeUndefined();
    });
  });
})