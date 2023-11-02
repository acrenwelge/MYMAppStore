/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ItemEntity } from "../../item/item.entity";
import { PurchaseCodeEntity } from "../../purchaseCode/purchaseCode.entity";
import { TransactionEntity } from "./transaction.entity";

/**
 * @description A join table between transactions and items. Each transaction may have multiple items.
 * @property {number} txDetailId - unique transaction detail identifier
 * @property {number} item - one of the items purchased in the transaction
 * @property {number} purchasecode - the purchase code used for this item in this transaction
 * @property {number} finalPrice - the price paid for this specific item in this transaction
 * @property {number} transaction - the transaction that this item was purchased in
 **/
@Entity("transaction_detail")
export class TransactionDetailEntity {
    @PrimaryGeneratedColumn({ name: "transaction_detail_id" })
    public txDetailId: number;

    @OneToOne(() => ItemEntity, item => item.itemId)
    @JoinColumn({ name: 'item_id' })
    public item: ItemEntity;

    @ManyToOne(() => PurchaseCodeEntity, purchaseCode => purchaseCode.name)
    @JoinColumn({ name: 'purchaseCode_name' })
    public purchaseCode?: PurchaseCodeEntity;

    @Column()
    public finalPrice: number;

    @Column()
    public quantity: number;

    @ManyToOne(() => TransactionEntity, transaction => transaction.transactionDetails)
    @JoinColumn({ name: 'transaction_id' })
    public transaction: TransactionEntity;

}
