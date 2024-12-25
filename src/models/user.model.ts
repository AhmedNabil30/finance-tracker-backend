// src/models/user.model.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from './transaction.model';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ nullable: true })
    name!: string;

    @OneToMany(() => Transaction, (transaction) => transaction.user)
    transactions!: Transaction[];
}

// src/models/transaction.model.ts
