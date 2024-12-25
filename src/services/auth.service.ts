// src/services/auth.service.ts
import { Repository } from 'typeorm';
import { User } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';

export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    // When the service is created, we get our User repository from TypeORM
    this.userRepository = AppDataSource.getRepository(User);
  }

  async register(userData: { email: string; password: string; name: string }) {
    try {
      // First, we check if a user with this email already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email }
      });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // If no existing user, we hash the password for security
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create a new user with the hashed password
      const user = this.userRepository.create({
        email: userData.email,
        password: hashedPassword,
        name: userData.name
      });

      // Save the user to the database
      const savedUser = await this.userRepository.save(user);

      // Generate a JWT token for the new user
      const token = this.generateToken(savedUser);

      // Remove the password from the response for security
      const { password: _, ...userWithoutPassword } = savedUser;

      return { user: userWithoutPassword, token };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      // Find the user by email
      const user = await this.userRepository.findOne({
        where: { email }
      });

      // If no user is found, throw an error
      if (!user) {
        throw new Error('User not found');
      }

      // Compare the provided password with the stored hash
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // If password doesn't match, throw an error
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      // Generate a new JWT token for the logged-in user
      const token = this.generateToken(user);

      // Remove the password from the response
      const { password: _, ...userWithoutPassword } = user;

      return { user: userWithoutPassword, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  private generateToken(user: User): string {
    console.log('Generating token with secret:', process.env.JWT_SECRET); // Debug log
    return jwt.sign(
        { 
            id: user.id, 
            email: user.email 
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
    );
}
}