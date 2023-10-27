/* eslint-disable prettier/prettier */
import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { ItemEntity } from "src/item/item.entity";
import { UserEntity } from "src/user/entities/user.entity";

/**
 * @description A record of a user's subscription to an item.
 * @property {number} subscription_id - unique record identifier
 * @property {@link ItemEntity} - the item purchased by the user in this record
 * @property {@link UserEntity} - the user who purchased the item in this record
 * @property {Date} expirationDate - date that the user's access to the item expires
 */
@Entity("subscription")
export class SubscriptionEntity {
    @PrimaryGeneratedColumn({name: "subscription_id"})
    public readonly subscriptionId: number;

    @ManyToOne(() => ItemEntity)
    @JoinColumn({ name: 'item_id' })
    public item: ItemEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'owner_id' })
    public owner: UserEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;

    @Column()
    public expirationDate: Date;

    constructor(subscriptionId?: number) {
        this.subscriptionId = subscriptionId;
    }
}
