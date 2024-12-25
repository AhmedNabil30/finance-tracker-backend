// src/config/database.ts
import { DataSource } from 'typeorm';
import { User } from '../models/user.model';
import * as dotenv from 'dotenv';
import { Transaction } from '../models/transaction.model';
// Load environment variables from .env file
dotenv.config();

// Create our database connection configuration
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'finance_tracker',
  entities: [User, Transaction],  // Add Transaction entity here
  synchronize: true,
  logging: true
});

// This function initializes our database connection
export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connection has been initialized successfully.');
    } catch (error) {
        console.error('Error during database initialization:', error);
        throw error;
    }
};