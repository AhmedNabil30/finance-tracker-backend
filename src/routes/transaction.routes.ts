// src/routes/transaction.routes.ts
import { Router, Request, Response } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { TransactionService } from '../services/transaction.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const transactionService = new TransactionService();
const transactionController = new TransactionController(transactionService);

// Apply auth middleware
router.use(authMiddleware);

// Route handlers with proper Express handler signatures
router.get('/', (req: Request, res: Response) => {
  transactionController.getTransactions(req, res);
});

router.post('/', (req: Request, res: Response) => {
  transactionController.addTransaction(req, res);
});

router.put('/:id', (req: Request, res: Response) => {
  transactionController.updateTransaction(req, res);
});

router.delete('/:id', (req: Request, res: Response) => {
  transactionController.deleteTransaction(req, res);
});

export default router;