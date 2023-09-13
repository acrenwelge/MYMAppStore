/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import { TransactionDetailEntity } from "./transaction-detail.entity";

/**
 * @description A record of each purchase made in the system. This is used to track the purchase history of each user.
 * Transactions can be purchases of one or more items.
 * @property {number} txId - unique transaction identifier
 * @property {number} transactionDetails - a list of items, purchase codes, and prices for each item in this transaction
 * @property {number} user - the user who made this transaction
 * @property {number} total - the price paid by the user in this transaction
 * @property {Date} date - the date that this transaction was created
 **/
@Entity("transaction")
export class TransactionEntity {
    @PrimaryGeneratedColumn({ name: "transaction_id" })
    public txId: number;

    @OneToMany(() => TransactionDetailEntity, transactionDetail => transactionDetail.transaction, { cascade: true })
    public transactionDetails: TransactionDetailEntity[];

    @ManyToOne(() => UserEntity, user => user.transactions)
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;

    @Column()
    public total: number;

    @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;
}
