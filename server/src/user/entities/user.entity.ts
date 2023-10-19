import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn} from "typeorm";
import {Exclude} from '@nestjs/class-transformer'
import {TransactionEntity} from "src/transaction/entities/transaction.entity";
import { Roles } from "src/roles/role.enum";
import { EnrollmentEntity } from "src/connection-entities/enrollment.entity";
import { SubscriptionEntity } from "src/subscription/subscription.entity";

/**
 * @description Represents the User table in the database
 * @property {number} id - unique user identifier
 * @property {string} first_name - user's first name
 * @property {string} last_name - user's last name
 * @property {string} email - user's email address
 * @property {string} passwordHash - user's hashed password
 * @property {boolean} activatedAccount - whether or not the user has activated their account
 * @property {string} activationCode - user must enter this to activate account; deleted after account activation
 * @property {Date} createdAt - date user was created
 * @property {Date} updatedAt - date user information was last updated
 * @property {@link Roles} role - user's role (admin, user, instructor)
 */
@Entity("user")
export class UserEntity {
    @PrimaryGeneratedColumn({name: "user_id"})
    public readonly userId: number;

    @Column()
    public firstName: string;

    @Column()
    public lastName: string;

    @Column({name: "email_address", unique: true})
    public email: string;

    @Exclude()
    @Column({nullable: true, name: "user_pw_hash"})
    public passwordHash: string;

    @Exclude()
    @Column({default: false, name: "activated_account"})
    public activatedAccount: boolean;

    @Exclude()
    @Column({nullable: true, name: "activation_code", length: 32})
    public activationCode?: string;

    @CreateDateColumn({name: "created_at"})
    public readonly createdAt: Date;

    @UpdateDateColumn({name: "updated_at"})
    public readonly updatedAt: Date;

    @Column()
    public role: Roles;

    @OneToMany(() => TransactionEntity, transaction => transaction.user)
    transactions: TransactionEntity[]
    // @OneToMany(() => SubscriptionEntity, subscription => subscription.user)
    // subscriptions: SubscriptionEntity[]
    
    constructor(userId?: number) {
        this.userId = userId;
    }
}
