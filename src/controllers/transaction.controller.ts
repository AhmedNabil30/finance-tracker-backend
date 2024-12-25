import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';

export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  async getTransactions(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = req.user.id;
    const transactions = await this.transactionService.getTransactions(userId);
    res.json(transactions);
  }

  async addTransaction(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = req.user.id;
    const transaction = await this.transactionService.addTransaction({
      ...req.body,
      userId
    });
    res.status(201).json(transaction);
  }

  async updateTransaction(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    const userId = req.user.id;
    const transaction = await this.transactionService.updateTransaction(
      parseInt(id),
      userId,
      req.body
    );
    res.json(transaction);
  }

  async deleteTransaction(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    const userId = req.user.id;
    await this.transactionService.deleteTransaction(parseInt(id), userId);
    res.status(204).send();
  }
}