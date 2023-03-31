/* eslint-disable prettier/prettier */
import {Column, CreateDateColumn, Double, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Exclude} from '@nestjs/class-transformer'

@Entity()
export class Record {
    @PrimaryGeneratedColumn({name: "record_id"})
    public readonly id: number;

    @Exclude()
    @Column()
    public readonly user_id: number;

    @Column()
    public readonly expirationDate: Date;
}