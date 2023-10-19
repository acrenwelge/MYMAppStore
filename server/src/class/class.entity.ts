/* eslint-disable prettier/prettier */
import { UserEntity } from "src/user/entities/user.entity";
import { EnrollmentEntity } from "src/connection-entities/enrollment.entity";
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";

/**
 * @description A class with an instructor that leads it
 * @property {number} class_id - unique class identifier
 * @property {number} instructor_id - unique instructor identifier
 */
@Entity("class")
export class ClassEntity {
    @PrimaryGeneratedColumn({name: "class_id"})
    public readonly classId: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'instructor_id' })
    public instructor: UserEntity;

    @OneToMany(() => EnrollmentEntity, enrollment => enrollment.classId)
    //@JoinColumn({ name: 'class_id' })
    public enrollments: EnrollmentEntity[];
}
