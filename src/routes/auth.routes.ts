// src/routes/auth.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';

const router = Router();

// Create a helper function to wrap async route handlers
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

// Initialize services and controller
const authService = new AuthService();
const authController = new AuthController(authService);

// Define routes with async error handling
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
    return await authController.register(req, res);
}));

router.post('/login', asyncHandler(async (req: Request, res: Response) => {
    return await authController.login(req, res);
}));

export default router;