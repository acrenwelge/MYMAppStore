import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { TransactionEntity } from "../transaction/entities/transaction.entity";
import { ItemEntity } from "src/item/item.entity";

/**
 * @description A purchase code that can be used to purchase a specific item at a discount
 * @property {number} code_id - unique purchase code identifier
 * @property {string} name - name of the purchase code
 * @property {@link ItemEntity} item - the item that this purchase code can apply to
 * @property {number} priceOff - amount of dollars that the purchase code takes off the price of an item
 * @property {@link TransactionEntity} transactions - a list of transactions that include this purchase code
 */
@Entity("purchase_code")
export class PurchaseCodeEntity {

    @PrimaryGeneratedColumn({name: "purchaseCode_id"})
    public code_id: number;

    @Column()
    @Unique("purchaseCode_name_unique", ["name"])
    public name: string;

    @ManyToOne(() => ItemEntity, item => item.itemId)
    @JoinColumn({ name: 'item_id' })
    public item: ItemEntity;

    @Column()
    public priceOff: number;

}
