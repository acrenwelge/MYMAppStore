/* eslint-disable prettier/prettier */
import { UserEntity } from "src/user/entities/user.entity";
import { ClassEntity } from "src/class/class.entity"
import {Column, Entity, JoinColumn, OneToMany, OneToOne, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

/**
 * @description A class that shows which class every student belongs to
 * @property {number} enrollment_id - unique enrollment identifier
 * @property {number} student_id - unique student identifier (user entity)
 * @property {number} class_id - unique class identifier (class entity)
 */
@Entity("enrollment")
export class EnrollmentEntity {
    @PrimaryGeneratedColumn({name: "enrollment_id"})
    public readonly enrollmentId: number;

    @ManyToOne(() => ClassEntity)
    @JoinColumn({ name: 'class_id' })
    public classId: ClassEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id' })
    public studentId: UserEntity[];
}
