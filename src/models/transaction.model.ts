import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.model';

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @Column('timestamp')
    date!: Date;

    @Column()
    description!: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount!: number;

    @Column({
        type: 'enum',
        enum: ['income', 'expense']
    })
    type!: 'income' | 'expense';

    @Column()
    category!: string;

    @ManyToOne(() => User, (user) => user.transactions)
    @JoinColumn({ name: 'userId' })
    user!: User;
}