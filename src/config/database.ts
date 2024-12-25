// src/config/database.ts
import { DataSource } from 'typeorm';
import { User } from '../models/user.model';
import * as dotenv from 'dotenv';
import { Transaction } from '../models/transaction.model';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || "postgresql://postgres:123456@db.hnnbebbjzfdsljyvkfeq.supabase.co:5432/postgres",
  ssl: {
    rejectUnauthorized: false
  },
  entities: [User, Transaction],
  synchronize: true, // Be careful with this in production
  logging: process.env.NODE_ENV === 'development',
  extra: {
    max: 20, // Connection pool settings
    connectionTimeoutMillis: 5000,
    keepAlive: true
  }
});

export const initializeDatabase = async () => {
    try {
        if (AppDataSource.isInitialized) {
            console.log('Database connection already exists.');
            return;
        }
        
        await AppDataSource.initialize();
        console.log('Database connection has been initialized successfully.');
    } catch (error) {
        console.error('Error during database initialization:', error);
        throw error;
    }
};

// Add a cleanup function
export const closeDatabase = async () => {
    try {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log('Database connection has been closed.');
        }
    } catch (error) {
        console.error('Error while closing database connection:', error);
        throw error;
    }
};