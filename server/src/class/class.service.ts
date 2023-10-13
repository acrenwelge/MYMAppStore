import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClassEntity } from "./class.entity";
import { Repository } from "typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { SubscriptionEntity } from "src/subscription/subscription.entity";

@Injectable()
export class ClassService {

  constructor(
    @InjectRepository(ClassEntity) private readonly classRepo: Repository<ClassEntity>,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(SubscriptionEntity) private readonly subscRepo: Repository<SubscriptionEntity>
  ) {}

  async createNewClass(instructorId?: number) {
    let newClass = this.classRepo.create()
    if (instructorId) {
      const instructor = await this.userRepo.findOne({where: {userId: instructorId}})
      newClass.instructor = instructor
    }
    return await this.classRepo.save(newClass)
  }

  async getAllClasses() {
    return await this.classRepo.find({relations: ['instructor', 'students']})
  }

  async getClassById(id: number) {
    return await this.classRepo.findOne({
      relations: ['instructor', 'students'], 
      where: {classId: id}
    })
  }

  async getClassByUserIdOfInstructor(userIdOfInstructor: number) {
    const classWithStudentsAndSubscriptions = await this.classRepo
      .createQueryBuilder("class")
      .leftJoinAndSelect("class.instructor", "instructor")
      .leftJoinAndSelect("class.students", "students")
      .leftJoinAndSelect("students.subscriptions", "subscriptions")
      .leftJoinAndSelect("subscriptions.owner", "owner")
      .select([
        "class",
        "instructor",
        "students.userId",
        "students.firstName",
        "students.lastName",
        "students.email",
        "subscriptions.subscriptionId",
        "owner.userId",
        "owner.role",
        "subscriptions.expirationDate"
      ])
      .where("instructor.userId = :userIdOfInstructor", { userIdOfInstructor })
      .getOne();
    return classWithStudentsAndSubscriptions;
  }

  async addStudentToClass(classId: number, studentEmail: string) {
    let classEntity = await this.classRepo
      .createQueryBuilder("class")
      .leftJoinAndSelect("class.instructor", "instructor")
      .leftJoinAndSelect("class.students", "students")
      .leftJoinAndSelect("students.subscriptions", "subscriptions")
      .leftJoinAndSelect("subscriptions.owner", "owner")
      .select([
        "class",
        "instructor",
        "students.userId",
        "students.firstName",
        "students.lastName",
        "students.email",
        "subscriptions.subscriptionId",
        "owner.userId",
        "owner.role",
        "subscriptions.expirationDate"
      ])
      .where("class.classId = :classId", { classId })
      .getOne();

    let userEntity = await this.userRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.subscriptions", "subscriptions")
      .leftJoinAndSelect("subscriptions.owner", "owner")
      .select([
        "user.userId",
        "user.firstName",
        "user.lastName",
        "user.email",
        "subscriptions.subscriptionId",
        "owner.userId",
        "owner.role",
        "subscriptions.expirationDate"
      ])
      .where("user.email = :studentEmail", { studentEmail })
      .getOne();
    if (!userEntity) {
      throw new Error(`No user with email ${studentEmail} found.`)
    }
    classEntity.students.push(userEntity)
    return await this.classRepo.save(classEntity)
  }

  async addMultipleStudentsToClass(studentIds: number[], classId: number) {
    let classEntity = await this.classRepo.findOne({where: {classId}})
    for (const sid of studentIds) {
      const userEntity = await this.userRepo.findOne({where: {userId: sid}})
      classEntity.students.push(userEntity)
    }
    return this.classRepo.save(classEntity)
  }

  async removeStudentFromClass(classId: number, studentUserId: number) {
    // let studentEntity = await this.userRepo.findOne({
    //   relations: ['class'],
    //   where: {userId: studentUserId}
    // })
    let studentEntity = await this.userRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.subscriptions", "subscriptions")
      .leftJoinAndSelect("subscriptions.owner", "owner")
      .select([
        "user.userId",
        "user.firstName",
        "user.lastName",
        "user.email",
        "subscriptions.subscriptionId",
        "owner.userId",
        "owner.role",
        "subscriptions.expirationDate"
      ])
      .where("user.userId = :studentUserId", { studentUserId })
      .getOne();
    studentEntity.class = null // unassign student from class
    await this.userRepo.save(studentEntity)
    // return await this.classRepo.findOne({
    //   relations: ['instructor','students'],
    //   where: {classId}
    // })
    return await this.classRepo
      .createQueryBuilder("class")
      .leftJoinAndSelect("class.instructor", "instructor")
      .leftJoinAndSelect("class.students", "students")
      .leftJoinAndSelect("students.subscriptions", "subscriptions")
      .leftJoinAndSelect("subscriptions.owner", "owner")
      .select([
        "class",
        "instructor",
        "students.userId",
        "students.firstName",
        "students.lastName",
        "students.email",
        "subscriptions.subscriptionId",
        "owner.userId",
        "owner.role",
        "subscriptions.expirationDate"
      ])
      .where("class.classId = :classId", { classId })
      .getOne();
  }
}