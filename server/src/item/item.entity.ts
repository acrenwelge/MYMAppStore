/* eslint-disable prettier/prettier */
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

/**
 * @description An item to be sold in the store (e.g. a course, a textbook, etc.)
 * If there are multiple lengths of subscriptions for the same item, there will be multiple entries in this table with the same name.
 * For example, if there is a 1-month subscription and a 6-month subscription for Calc 1, there will be two entries in this table with the name "Calc 1".
 * @property {number} itemId - unique item identifier
 * @property {string} name - name of the item (e.g. "Calc 1")
 * @property {number} price - regular price of the item before any discounts
 * @property {number} subscriptionLengthMonths - length of time in months that the user has access to the item after purchase
 */
@Entity("item")
export class ItemEntity {
    @PrimaryGeneratedColumn({name: "item_id"})
    public readonly itemId: number;

    @Column()
    public name: string;

    @Column()
    public price: number;

    @Column()
    public subscriptionLengthMonths: number;

    constructor(itemId?: number) {
        this.itemId = itemId;
    }
}
