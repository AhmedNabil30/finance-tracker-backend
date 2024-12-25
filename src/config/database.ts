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
  url: "postgresql://postgres:123456@db.hnnbebbjzfdsljyvkfeq.supabase.co:5432/postgres", // Use connection string directly
  ssl: { 
    rejectUnauthorized: false // Important for most free databases
  },
  entities: [User, Transaction],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development'
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