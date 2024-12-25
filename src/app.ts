// src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { initializeDatabase } from './config/database';
import authRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';  
import { authMiddleware } from './middleware/auth.middleware'; 
import * as dotenv from 'dotenv';

dotenv.config();

const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Uncaught error:', err);
    res.status(500).json({
        message: 'An unexpected error occurred',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

const startServer = async () => {
    try {
        await initializeDatabase();
        console.log('Database connection established successfully');

        const app: Application = express();

        // Middleware
        app.use(cors({
          origin: [
            'https://your-frontend-vercel-url.vercel.app',
            'http://localhost:4200' // For local development
          ],
          credentials: true
        }));
        app.use(express.json());

        // Routes registration
        app.get('/health', (req: Request, res: Response) => {
            res.json({ status: 'ok', timestamp: new Date().toISOString() });
        });

        app.use('/auth', authRoutes);
        // Add transaction routes with authentication middleware
        app.use('/transactions', transactionRoutes); 

        // Error handlers
        app.use(globalErrorHandler);

        app.use((req: Request, res: Response) => {
            res.status(404).json({ message: 'Route not found' });
        });

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
            console.log(`Health check available at http://localhost:${PORT}/health`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Error handlers for unhandled rejections and exceptions
process.on('unhandledRejection', (reason: any) => {
    console.error('Unhandled Promise rejection:', reason);
    process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

startServer().catch(error => {
    console.error('Failed to start application:', error);
    process.exit(1);
});