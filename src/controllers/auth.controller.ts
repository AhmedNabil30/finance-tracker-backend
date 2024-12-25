import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(req: Request, res: Response) {
    try {
      // Extract credentials from request body
      const { email, password } = req.body;

      // Validate that required fields are present
      if (!email || !password) {
        return res.status(400).json({
          message: 'Login failed',
          details: 'Email and password are required'
        });
      }

      // Attempt to log in the user through the auth service
      const result = await this.authService.login(email, password);
      res.json(result);

    } catch (error) {
      // Log the error for debugging purposes
      console.error('Login error:', error);

      // Provide more specific error messages based on the error type
      if (error instanceof Error) {
        if (error.message === 'User not found') {
          return res.status(404).json({
            message: 'Login failed',
            details: 'No user found with this email'
          });
        }
        if (error.message === 'Invalid password') {
          return res.status(401).json({
            message: 'Login failed',
            details: 'Incorrect password'
          });
        }
      }

      // Generic error response if the error type is not recognized
      res.status(401).json({
        message: 'Login failed',
        details: 'Invalid email or password'
      });
    }
  }

  async register(req: Request, res: Response) {
    try {
      // Extract registration data from request body
      const { email, password, name } = req.body;

      // Validate that all required fields are present
      if (!email || !password || !name) {
        return res.status(400).json({
          message: 'Registration failed',
          details: 'Email, password, and name are required'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: 'Registration failed',
          details: 'Invalid email format'
        });
      }

      // Validate password length
      if (password.length < 6) {
        return res.status(400).json({
          message: 'Registration failed',
          details: 'Password must be at least 6 characters long'
        });
      }

      // Attempt to register the user through the auth service
      const result = await this.authService.register({ email, password, name });
      res.status(201).json(result);

    } catch (error) {
      // Log the error for debugging purposes
      console.error('Registration error:', error);

      // Provide more specific error messages based on the error type
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          return res.status(409).json({
            message: 'Registration failed',
            details: 'A user with this email already exists'
          });
        }
      }

      // Generic error response if the error type is not recognized
      res.status(400).json({
        message: 'Registration failed',
        details: 'Could not complete registration. Please try again.'
      });
    }
  }
}