import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { TransactionEntity } from "../transaction/entities/transaction.entity";
import { ItemEntity } from "src/item/item.entity";

/**
 * @description A purchase code that can be used to purchase a specific item at a discount
 * @property {string} name - name of the purchase code
 * @property {@link ItemEntity} item - the item that this purchase code can apply to
 * @property {number} salePrice - amount in dollars that the item will cost when this 
 * purchase code is used (overrides the item's price)
 * @property {@link TransactionEntity} transactions - a list of transactions that include this purchase code
 */
@Entity("purchase_code")
export class PurchaseCodeEntity {

    @PrimaryColumn() // no need for an ID column, since the name is unique
    public name: string;

    @ManyToOne(() => ItemEntity, item => item.itemId)
    @JoinColumn({ name: 'item_id' })
    public item: ItemEntity;

    @Column()
    public salePrice: number;

}
