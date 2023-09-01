import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

/**
 * @description Tracks which email suffixes are given free access to the textbooks. All items are accessible 
 * to users whose email addresses end in one of these suffixes.
 * @param email_sub_id - primary key
 * @param suffix - the suffix of the email address (e.g. 'tamu.edu')
 */
@Entity("free_subscription")
export class FreeSubscriptionEntity {

  @PrimaryGeneratedColumn({name: "email_subscription_id"})
  public email_sub_id: number;

  @Column()
  public suffix: string;

}
