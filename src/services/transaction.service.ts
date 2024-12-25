// src/services/transaction.service.ts
import { Transaction } from '../models/transaction.model';
import { AppDataSource } from '../config/database';

export class TransactionService {
  private transactionRepository = AppDataSource.getRepository(Transaction);

  async getTransactions(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { userId },
      order: { date: 'DESC' }
    });
  }

  async addTransaction(transactionData: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.transactionRepository.create(transactionData);
    return this.transactionRepository.save(transaction);
  }

  async updateTransaction(
    id: number,
    userId: number,
    transactionData: Partial<Transaction>
  ): Promise<Transaction> {
    await this.transactionRepository.update(
      { id, userId },
      transactionData
    );
    return this.transactionRepository.findOneOrFail({ where: { id, userId } });
  }

  async deleteTransaction(id: number, userId: number): Promise<void> {
    await this.transactionRepository.delete({ id, userId });
  }
}